//#region index.ts
/** Sentinel value for unconstrained space in scroll containers.
*  Children of overflow:scroll containers get this as available height/width
*  so they can lay out at their natural size. */
const UNCONSTRAINED = 1e5;
/** Dev-mode: warn once when percentage sizes are used inside a scroll container. */
let _warnedPercentInScroll = false;
function resolvePadding(p) {
	const base = p.padding ?? 0;
	const px = p.paddingX ?? base;
	const py = p.paddingY ?? base;
	return {
		top: p.paddingTop ?? py,
		bottom: p.paddingBottom ?? py,
		left: p.paddingLeft ?? px,
		right: p.paddingRight ?? px
	};
}
function resolveMarginValue(specific, fallback) {
	const v = specific ?? fallback;
	if (v === "auto") return {
		value: 0,
		isAuto: true
	};
	return {
		value: v,
		isAuto: false
	};
}
function resolveMargin(p) {
	const base = p.margin ?? 0;
	const mx = p.marginX ?? base;
	const my = p.marginY ?? base;
	return {
		top: resolveMarginValue(p.marginTop, my).value,
		bottom: resolveMarginValue(p.marginBottom, my).value,
		left: resolveMarginValue(p.marginLeft, mx).value,
		right: resolveMarginValue(p.marginRight, mx).value
	};
}
function resolveMarginAuto(p) {
	const base = p.margin ?? 0;
	const mx = p.marginX ?? base;
	const my = p.marginY ?? base;
	return {
		top: resolveMarginValue(p.marginTop, my).isAuto,
		bottom: resolveMarginValue(p.marginBottom, my).isAuto,
		left: resolveMarginValue(p.marginLeft, mx).isAuto,
		right: resolveMarginValue(p.marginRight, mx).isAuto
	};
}
function resolveSize(value, parentSize, node, axis) {
	if (value === void 0 || value === "auto") return void 0;
	if (typeof value === "number") return value;
	if (value === "min-content") {
		if (!node) return void 0;
		if (axis === "width") {
			if (node.measureText) {
				const measured = node.measureText(0);
				const pad = resolvePadding(node.props);
				return measured.width + pad.left + pad.right;
			}
			return measureNaturalWidth(node, parentSize);
		}
		if (node.measureText) {
			const measured = node.measureText(UNCONSTRAINED);
			const pad = resolvePadding(node.props);
			return measured.height + pad.top + pad.bottom;
		}
		return measureNaturalHeight(node, parentSize);
	}
	if (value === "max-content") {
		if (!node) return void 0;
		if (axis === "width") {
			if (node.measureText) {
				const measured = node.measureText(UNCONSTRAINED);
				const pad = resolvePadding(node.props);
				return measured.width + pad.left + pad.right;
			}
			return measureNaturalWidth(node, parentSize);
		}
		if (node.measureText) {
			const measured = node.measureText(parentSize);
			const pad = resolvePadding(node.props);
			return measured.height + pad.top + pad.bottom;
		}
		return measureNaturalHeight(node, parentSize);
	}
	if (parentSize >= UNCONSTRAINED) {
		if (!_warnedPercentInScroll) {
			_warnedPercentInScroll = true;
			process.stderr.write("[storm] Warning: Percentage width/height inside a ScrollView is not supported (parent size is unconstrained). Falling back to auto sizing. Use explicit numeric values instead.\n");
		}
		return;
	}
	return Math.floor(parseFloat(value) / 100 * parentSize);
}
function clampSize(size, min, max) {
	let s = size;
	if (min !== void 0 && s < min) s = min;
	if (max !== void 0 && s > max) s = max;
	return Math.max(0, s);
}
/**
* Flip the x position of a child node (and its descendants) for RTL row layout.
* child.x = parentInnerX + parentInnerWidth - (child.x - parentInnerX) - child.width
*/
function flipXRecursive(node, parentInnerX, parentInnerWidth) {
	const layout = node.layout;
	const flippedX = parentInnerX + parentInnerWidth - (layout.x - parentInnerX) - layout.width;
	const dx = flippedX - layout.x;
	layout.x = flippedX;
	layout.innerX += dx;
	for (const child of node.children) shiftXRecursive(child, dx);
}
function shiftXRecursive(node, dx) {
	node.layout.x += dx;
	node.layout.innerX += dx;
	for (const child of node.children) shiftXRecursive(child, dx);
}
/**
* Shift an entire subtree by (dx, dy) without recomputing sizes.
* Used by incremental layout caching when a clean subtree only moved position.
*/
function shiftSubtree(node, dx, dy) {
	node.layout.x += dx;
	node.layout.y += dy;
	node.layout.innerX += dx;
	node.layout.innerY += dy;
	for (const child of node.children) shiftSubtree(child, dx, dy);
}
function parseGridTemplate(template) {
	if (!template) return [];
	return template.trim().split(/\s+/).map((token) => {
		if (token.endsWith("fr")) return {
			type: "fr",
			value: parseFloat(token) || 1
		};
		if (token === "auto") return {
			type: "auto",
			value: 0
		};
		return {
			type: "fixed",
			value: parseInt(token, 10) || 0
		};
	});
}
/** Parse grid placement like "1 / 3", "span 2", or "2" into start (0-based) and span */
function parseGridPlacement(placement, autoIndex, trackCount) {
	if (!placement) return {
		start: autoIndex,
		span: 1
	};
	const trimmed = placement.trim();
	const spanMatch = trimmed.match(/^span\s+(\d+)$/);
	if (spanMatch) return {
		start: autoIndex,
		span: parseInt(spanMatch[1], 10)
	};
	const slashIdx = trimmed.indexOf("/");
	const slashMatch = slashIdx > 0 ? [
		trimmed,
		trimmed.slice(0, slashIdx).trim(),
		trimmed.slice(slashIdx + 1).trim()
	] : null;
	if (slashMatch) {
		const start = parseInt(slashMatch[1], 10) - 1;
		const endPart = slashMatch[2].trim();
		const spanInEnd = endPart.match(/^span\s+(\d+)$/);
		if (spanInEnd) return {
			start,
			span: parseInt(spanInEnd[1], 10)
		};
		const end = parseInt(endPart, 10) - 1;
		return {
			start,
			span: Math.max(1, end - start)
		};
	}
	const num = parseInt(trimmed, 10);
	if (!isNaN(num)) return {
		start: num - 1,
		span: 1
	};
	return {
		start: autoIndex,
		span: 1
	};
}
function resolveGridTrackSizes(tracks, availableSize, gap, children, axis, placements) {
	if (tracks.length === 0) return [];
	const totalGap = gap * Math.max(0, tracks.length - 1);
	let fixedTotal = 0;
	let frTotal = 0;
	const sizes = new Array(tracks.length).fill(0);
	for (let i = 0; i < tracks.length; i++) {
		const track = tracks[i];
		if (track.type === "fixed") {
			sizes[i] = track.value;
			fixedTotal += track.value;
		} else if (track.type === "fr") frTotal += track.value;
	}
	for (let i = 0; i < tracks.length; i++) if (tracks[i].type === "auto") {
		let maxSize = 0;
		for (let ci = 0; ci < children.length; ci++) {
			const p = placements[ci];
			const placement = axis === "col" ? p.col : p.row;
			if (placement.start === i && placement.span === 1) {
				const child = children[ci];
				if (axis === "col") maxSize = Math.max(maxSize, measureNaturalWidth(child, availableSize));
				else maxSize = Math.max(maxSize, measureNaturalHeight(child, availableSize));
			}
		}
		sizes[i] = maxSize;
		fixedTotal += maxSize;
	}
	for (let ci = 0; ci < children.length; ci++) {
		const p = placements[ci];
		const placement = axis === "col" ? p.col : p.row;
		if (placement.span <= 1) continue;
		const autoIndices = [];
		let currentSpanTotal = 0;
		for (let t = placement.start; t < placement.start + placement.span && t < tracks.length; t++) {
			currentSpanTotal += sizes[t];
			if (t > placement.start) currentSpanTotal += gap;
			if (tracks[t].type === "auto") autoIndices.push(t);
		}
		if (autoIndices.length === 0) continue;
		const child = children[ci];
		let naturalSize;
		if (axis === "col") naturalSize = measureNaturalWidth(child, availableSize);
		else naturalSize = measureNaturalHeight(child, availableSize);
		const excess = naturalSize - currentSpanTotal;
		if (excess > 0) {
			const perTrack = Math.floor(excess / autoIndices.length);
			for (const idx of autoIndices) {
				sizes[idx] += perTrack;
				fixedTotal += perTrack;
			}
		}
	}
	const remaining = Math.max(0, availableSize - fixedTotal - totalGap);
	if (frTotal > 0) for (let i = 0; i < tracks.length; i++) {
		const track = tracks[i];
		if (track.type === "fr") sizes[i] = Math.floor(track.value / frTotal * remaining);
	}
	return sizes;
}
/**
* Compute grid layout for a node with display: "grid".
*
* Algorithm overview:
*   Phase 0: Resolve gap values (columnGap, rowGap, gap shorthand)
*   Phase 1: Place items with explicit gridColumn/gridRow first,
*            then auto-place remaining items respecting gridAutoFlow
*   Phase 2: Resolve track sizes (fixed -> auto -> fr)
*   Phase 3: Position children in cells with alignment support
*/
function computeGridLayout(node, innerX, innerY, innerWidth, innerHeight) {
	const props = node.props;
	const autoFlow = props.gridAutoFlow ?? "row";
	const gapBase = props.gap ?? props.gridGap ?? 0;
	const colGap = props.columnGap ?? gapBase;
	const rowGap = props.rowGap ?? gapBase;
	const colTracks = parseGridTemplate(props.gridTemplateColumns);
	const rowTracks = parseGridTemplate(props.gridTemplateRows);
	if (colTracks.length === 0) colTracks.push({
		type: "fr",
		value: 1
	});
	if (rowTracks.length === 0) rowTracks.push({
		type: "auto",
		value: 0
	});
	const visibleChildren = node.children.filter((c) => c.props.display !== "none");
	for (const child of node.children) if (child.props.display === "none") computeLayout(child, innerX, innerY, 0, 0);
	const occupied = /* @__PURE__ */ new Map();
	const markOccupied = (r, c, rs, cs) => {
		for (let ri = r; ri < r + rs; ri++) for (let ci = c; ci < c + cs; ci++) occupied.set(`${ri},${ci}`, true);
	};
	const isOccupied = (r, c, rs, cs) => {
		for (let ri = r; ri < r + rs; ri++) for (let ci = c; ci < c + cs; ci++) if (occupied.get(`${ri},${ci}`)) return true;
		return false;
	};
	const placements = new Array(visibleChildren.length).fill(void 0);
	const ensureRowTracks = (needed) => {
		while (rowTracks.length < needed) rowTracks.push({
			type: "auto",
			value: 0
		});
	};
	for (let i = 0; i < visibleChildren.length; i++) {
		const cp = visibleChildren[i].props;
		const colPlacement = parseGridPlacement(cp.gridColumn, -1, colTracks.length);
		const rowPlacement = parseGridPlacement(cp.gridRow, -1, rowTracks.length);
		const hasExplicitCol = cp.gridColumn !== void 0 && !cp.gridColumn.trim().startsWith("span");
		const hasExplicitRow = cp.gridRow !== void 0 && !cp.gridRow.trim().startsWith("span");
		if (hasExplicitCol && hasExplicitRow) {
			const finalCol = colPlacement.start;
			const finalRow = rowPlacement.start;
			const colSpan = colPlacement.span;
			const rowSpan = rowPlacement.span;
			ensureRowTracks(finalRow + rowSpan);
			markOccupied(finalRow, finalCol, rowSpan, colSpan);
			placements[i] = {
				col: {
					start: finalCol,
					span: colSpan
				},
				row: {
					start: finalRow,
					span: rowSpan
				}
			};
		}
	}
	for (let i = 0; i < visibleChildren.length; i++) {
		if (placements[i] !== void 0) continue;
		const cp = visibleChildren[i].props;
		const colPlacement = parseGridPlacement(cp.gridColumn, -1, colTracks.length);
		const rowPlacement = parseGridPlacement(cp.gridRow, -1, rowTracks.length);
		const hasExplicitCol = cp.gridColumn !== void 0 && !cp.gridColumn.trim().startsWith("span");
		const hasExplicitRow = cp.gridRow !== void 0 && !cp.gridRow.trim().startsWith("span");
		if (hasExplicitCol && !hasExplicitRow) {
			const finalCol = colPlacement.start;
			const colSpan = colPlacement.span;
			const rowSpan = rowPlacement.span;
			let finalRow = 0;
			while (isOccupied(finalRow, finalCol, rowSpan, colSpan)) finalRow++;
			ensureRowTracks(finalRow + rowSpan);
			markOccupied(finalRow, finalCol, rowSpan, colSpan);
			placements[i] = {
				col: {
					start: finalCol,
					span: colSpan
				},
				row: {
					start: finalRow,
					span: rowSpan
				}
			};
		} else if (!hasExplicitCol && hasExplicitRow) {
			const finalRow = rowPlacement.start;
			const colSpan = colPlacement.span;
			const rowSpan = rowPlacement.span;
			let finalCol = 0;
			while (isOccupied(finalRow, finalCol, rowSpan, colSpan)) finalCol++;
			ensureRowTracks(finalRow + rowSpan);
			markOccupied(finalRow, finalCol, rowSpan, colSpan);
			placements[i] = {
				col: {
					start: finalCol,
					span: colSpan
				},
				row: {
					start: finalRow,
					span: rowSpan
				}
			};
		}
	}
	let autoRow = 0;
	let autoCol = 0;
	for (let i = 0; i < visibleChildren.length; i++) {
		if (placements[i] !== void 0) continue;
		const cp = visibleChildren[i].props;
		const colPlacement = parseGridPlacement(cp.gridColumn, -1, colTracks.length);
		const rowPlacement = parseGridPlacement(cp.gridRow, -1, rowTracks.length);
		const colSpan = colPlacement.span;
		const rowSpan = rowPlacement.span;
		if (autoFlow === "row" || autoFlow === "dense") {
			if (autoFlow === "dense") {
				autoRow = 0;
				autoCol = 0;
			}
			while (isOccupied(autoRow, autoCol, rowSpan, colSpan) || autoCol + colSpan > colTracks.length) {
				autoCol++;
				if (autoCol + colSpan > colTracks.length) {
					autoCol = 0;
					autoRow++;
				}
			}
			const finalCol = autoCol;
			const finalRow = autoRow;
			ensureRowTracks(finalRow + rowSpan);
			markOccupied(finalRow, finalCol, rowSpan, colSpan);
			placements[i] = {
				col: {
					start: finalCol,
					span: colSpan
				},
				row: {
					start: finalRow,
					span: rowSpan
				}
			};
			if (autoFlow !== "dense") {
				autoCol += colSpan;
				if (autoCol >= colTracks.length) {
					autoCol = 0;
					autoRow++;
				}
			}
		} else {
			while (isOccupied(autoRow, autoCol, rowSpan, colSpan) || autoRow + rowSpan > rowTracks.length) {
				autoRow++;
				if (autoRow + rowSpan > rowTracks.length) {
					autoRow = 0;
					autoCol++;
				}
				if (autoCol >= colTracks.length) break;
			}
			const finalCol = autoCol;
			const finalRow = autoRow;
			ensureRowTracks(finalRow + rowSpan);
			markOccupied(finalRow, finalCol, rowSpan, colSpan);
			placements[i] = {
				col: {
					start: finalCol,
					span: colSpan
				},
				row: {
					start: finalRow,
					span: rowSpan
				}
			};
			autoRow += rowSpan;
		}
	}
	const finalPlacements = placements;
	const colSizes = resolveGridTrackSizes(colTracks, innerWidth, colGap, visibleChildren, "col", finalPlacements);
	const rowSizes = resolveGridTrackSizes(rowTracks, innerHeight, rowGap, visibleChildren, "row", finalPlacements);
	const colOffsets = [0];
	for (let i = 0; i < colSizes.length; i++) {
		const gapAfter = i < colSizes.length - 1 ? colGap : 0;
		colOffsets.push(colOffsets[i] + colSizes[i] + gapAfter);
	}
	const rowOffsets = [0];
	for (let i = 0; i < rowSizes.length; i++) {
		const gapAfter = i < rowSizes.length - 1 ? rowGap : 0;
		rowOffsets.push(rowOffsets[i] + rowSizes[i] + gapAfter);
	}
	const parentAlignItems = props.alignItems ?? "stretch";
	let maxContentBottom = 0;
	let maxContentRight = 0;
	for (let i = 0; i < visibleChildren.length; i++) {
		const child = visibleChildren[i];
		const placement = finalPlacements[i];
		const cellX = innerX + (colOffsets[placement.col.start] ?? 0);
		const cellY = innerY + (rowOffsets[placement.row.start] ?? 0);
		let cellWidth = 0;
		for (let c = placement.col.start; c < placement.col.start + placement.col.span && c < colSizes.length; c++) {
			cellWidth += colSizes[c];
			if (c > placement.col.start) cellWidth += colGap;
		}
		let cellHeight = 0;
		for (let r = placement.row.start; r < placement.row.start + placement.row.span && r < rowSizes.length; r++) {
			cellHeight += rowSizes[r];
			if (r > placement.row.start) cellHeight += rowGap;
		}
		const childAlignSelf = child.props.alignSelf;
		const effectiveAlign = childAlignSelf !== void 0 && childAlignSelf !== "auto" ? childAlignSelf : parentAlignItems;
		let childW = cellWidth;
		let childH = cellHeight;
		let childX = cellX;
		let childY = cellY;
		if (effectiveAlign !== "stretch") {
			const naturalH = measureNaturalHeight(child, cellWidth);
			childH = Math.min(naturalH, cellHeight);
			switch (effectiveAlign) {
				case "center":
					childY = cellY + Math.floor((cellHeight - childH) / 2);
					break;
				case "end":
					childY = cellY + cellHeight - childH;
					break;
				case "baseline": childY = cellY + cellHeight - childH;
			}
		}
		const childAR = child.props.aspectRatio;
		if (childAR !== void 0 && childAR > 0) {
			const hasExplicitW = child.props.width !== void 0;
			const hasExplicitH = child.props.height !== void 0;
			if (hasExplicitW && !hasExplicitH) childH = UNCONSTRAINED;
			else if (!hasExplicitW && !hasExplicitH) childH = UNCONSTRAINED;
		}
		computeLayout(child, childX, childY, childW, childH);
		maxContentBottom = Math.max(maxContentBottom, cellY + cellHeight - innerY);
		maxContentRight = Math.max(maxContentRight, cellX + cellWidth - innerX);
	}
	node.layout.contentHeight = Math.max(maxContentBottom, innerHeight);
	node.layout.contentWidth = Math.max(maxContentRight, innerWidth);
}
/**
* Resolve flexbox constraints for the full tree, mutating each node's `.layout` in place.
* Incremental: skips clean subtrees when props and constraints haven't changed.
*/
function computeLayout(node, x, y, availableWidth, availableHeight) {
	const props = node.props;
	if (!node.dirty && node._prevProps === props && node._prevWidth === availableWidth && node._prevHeight === availableHeight) {
		if (node.layout.x !== x || node.layout.y !== y) shiftSubtree(node, x - node.layout.x, y - node.layout.y);
		return;
	}
	if (props.display === "none") {
		node.layout = {
			x,
			y,
			width: 0,
			height: 0,
			innerX: x,
			innerY: y,
			innerWidth: 0,
			innerHeight: 0,
			contentHeight: 0,
			contentWidth: 0
		};
		node.dirty = false;
		node._prevProps = props;
		node._prevWidth = availableWidth;
		node._prevHeight = availableHeight;
		return;
	}
	const pad = resolvePadding(props);
	let width = resolveSize(props.width, availableWidth, node, "width") ?? availableWidth;
	let height = resolveSize(props.height, availableHeight, node, "height") ?? availableHeight;
	if (props.aspectRatio !== void 0 && props.aspectRatio > 0) {
		const hasExplicitWidth = props.width !== void 0;
		const hasExplicitHeight = props.height !== void 0;
		if (hasExplicitWidth && !hasExplicitHeight) height = Math.round(width / props.aspectRatio);
		else if (!hasExplicitWidth && hasExplicitHeight) width = Math.round(height * props.aspectRatio);
	}
	const flexGrow = props.flexGrow ?? props.flex ?? 0;
	if (height >= UNCONSTRAINED && props.height === void 0 && flexGrow === 0) height = measureNaturalHeight(node, width);
	width = clampSize(width, props.minWidth, props.maxWidth);
	height = clampSize(height, props.minHeight, props.maxHeight);
	const innerWidth = Math.max(0, width - pad.left - pad.right);
	const innerHeight = Math.max(0, height - pad.top - pad.bottom);
	const innerX = x + pad.left;
	const innerY = y + pad.top;
	node.layout = {
		x,
		y,
		width,
		height,
		innerX,
		innerY,
		innerWidth,
		innerHeight,
		contentHeight: innerHeight,
		contentWidth: innerWidth
	};
	if (node.children.length === 0) {
		if (node.measureText) {
			const measured = node.measureText(innerWidth);
			node.layout.contentHeight = measured.height;
			node.layout.contentWidth = measured.width;
			if (props.height === void 0 && flexGrow === 0) {
				node.layout.height = measured.height + pad.top + pad.bottom;
				node.layout.innerHeight = measured.height;
				node.layout.contentHeight = measured.height;
			}
		}
		node.dirty = false;
		node._prevProps = props;
		node._prevWidth = availableWidth;
		node._prevHeight = availableHeight;
		return;
	}
	if (props.display === "grid") {
		computeGridLayout(node, innerX, innerY, innerWidth, innerHeight);
		node.dirty = false;
		node._prevProps = props;
		node._prevWidth = availableWidth;
		node._prevHeight = availableHeight;
		return;
	}
	const direction = props.flexDirection ?? "column";
	const wrap = props.flexWrap ?? "nowrap";
	const isColumn = direction === "column";
	const isRtl = (props.direction ?? "ltr") === "rtl";
	const gapBase = props.gap ?? 0;
	const resolvedColumnGap = props.columnGap ?? gapBase;
	const resolvedRowGap = props.rowGap ?? gapBase;
	const mainAxisGap = isColumn ? resolvedRowGap : resolvedColumnGap;
	const crossAxisGap = isColumn ? resolvedColumnGap : resolvedRowGap;
	const align = props.alignItems ?? "stretch";
	const justify = props.justifyContent ?? "start";
	const allVisibleChildren = node.children.filter((c) => c.props.display !== "none");
	const visibleChildrenUnsorted = allVisibleChildren.filter((c) => c.props.position !== "absolute");
	const absoluteChildren = allVisibleChildren.filter((c) => c.props.position === "absolute");
	const visibleChildren = [...visibleChildrenUnsorted].sort((a, b) => (a.props.order ?? 0) - (b.props.order ?? 0));
	for (const child of node.children) if (child.props.display === "none") computeLayout(child, innerX, innerY, 0, 0);
	function measureChildEntry(child) {
		const cp = child.props;
		const childFlexGrow = cp.flexGrow ?? cp.flex ?? 0;
		const childFlexShrink = cp.flexShrink ?? (child.measureText ? 0 : 1);
		const childMargin = resolveMargin(cp);
		const childMarginAuto = resolveMarginAuto(cp);
		const mainMargin = isColumn ? childMargin.top + childMargin.bottom : childMargin.left + childMargin.right;
		const crossMargin = isColumn ? childMargin.left + childMargin.right : childMargin.top + childMargin.bottom;
		const basisRaw = cp.flexBasis;
		const mainAvailableForBasis = isColumn ? innerHeight : innerWidth;
		const basisVal = basisRaw !== void 0 ? resolveSize(basisRaw, mainAvailableForBasis) : void 0;
		let natural;
		if (childFlexGrow > 0 && basisVal === void 0) natural = 0;
		else if (basisVal !== void 0) natural = basisVal;
		else {
			const resolved = resolveSize(isColumn ? cp.height : cp.width, mainAvailableForBasis);
			if (resolved !== void 0) natural = resolved;
			else if (child.measureText) {
				const measureWidth = isColumn ? Math.max(0, innerWidth - crossMargin) : UNCONSTRAINED;
				const measured = child.measureText(measureWidth);
				natural = isColumn ? measured.height : measured.width;
				const childPad = resolvePadding(cp);
				natural += isColumn ? childPad.top + childPad.bottom : childPad.left + childPad.right;
			} else if (isColumn) natural = measureNaturalHeight(child, Math.max(0, innerWidth - crossMargin));
			else natural = measureNaturalWidth(child, Math.max(0, innerHeight - crossMargin));
			const min = isColumn ? cp.minHeight : cp.minWidth;
			const max = isColumn ? cp.maxHeight : cp.maxWidth;
			natural = clampSize(natural, min, max);
		}
		let naturalCross;
		const crossResolved = resolveSize(isColumn ? cp.width : cp.height, isColumn ? innerWidth : innerHeight);
		if (crossResolved !== void 0) naturalCross = crossResolved;
		else if (isColumn) naturalCross = measureNaturalWidth(child, innerHeight);
		else naturalCross = measureNaturalHeight(child, innerWidth);
		let originalNatural = natural;
		if (childFlexGrow > 0 && basisVal === void 0) {
			if (child.measureText) {
				const mw = isColumn ? Math.max(0, innerWidth - crossMargin) : UNCONSTRAINED;
				const m = child.measureText(mw);
				originalNatural = isColumn ? m.height : m.width;
			} else originalNatural = isColumn ? measureNaturalHeight(child, Math.max(0, innerWidth - crossMargin)) : measureNaturalWidth(child, Math.max(0, innerHeight - crossMargin));
		}
		return {
			natural,
			originalNatural,
			flexGrow: childFlexGrow,
			flexShrink: childFlexShrink,
			margin: childMargin,
			marginAuto: childMarginAuto,
			mainMargin,
			crossMargin,
			naturalCross,
			node: child
		};
	}
	const childEntries = visibleChildren.map(measureChildEntry);
	const mainSize = isColumn ? innerHeight : innerWidth;
	const crossSize = isColumn ? innerWidth : innerHeight;
	let wrapLines;
	if (wrap === "wrap") {
		wrapLines = [];
		let currentLine = [];
		let currentMainTotal = 0;
		for (const entry of childEntries) {
			const entryMain = entry.natural + entry.mainMargin;
			const gapBefore = currentLine.length > 0 ? mainAxisGap : 0;
			if (currentLine.length > 0 && currentMainTotal + gapBefore + entryMain > mainSize) {
				const crossMax = Math.max(...currentLine.map((e) => e.naturalCross + e.crossMargin), 0);
				wrapLines.push({
					entries: currentLine,
					mainTotal: currentMainTotal,
					crossMax
				});
				currentLine = [entry];
				currentMainTotal = entryMain;
			} else {
				currentLine.push(entry);
				currentMainTotal += gapBefore + entryMain;
			}
		}
		if (currentLine.length > 0) {
			const crossMax = Math.max(...currentLine.map((e) => e.naturalCross + e.crossMargin), 0);
			wrapLines.push({
				entries: currentLine,
				mainTotal: currentMainTotal,
				crossMax
			});
		}
	} else {
		const totalMarginMain = childEntries.reduce((s, e) => s + e.mainMargin, 0);
		wrapLines = [{
			entries: childEntries,
			mainTotal: childEntries.reduce((s, e) => s + e.natural, 0) + totalMarginMain + mainAxisGap * Math.max(0, childEntries.length - 1),
			crossMax: crossSize
		}];
	}
	let crossOffset = 0;
	let contentTotal = 0;
	const alignContentVal = props.alignContent ?? "stretch";
	let alignContentStartOffset = 0;
	let alignContentLineGap = crossAxisGap;
	if (wrap === "wrap" && wrapLines.length > 1) {
		const totalLineCross = wrapLines.reduce((s, l) => s + l.crossMax, 0);
		const totalCrossGaps = crossAxisGap * (wrapLines.length - 1);
		const freeCross = crossSize - totalLineCross - totalCrossGaps;
		switch (alignContentVal) {
			case "flex-start": break;
			case "flex-end":
				alignContentStartOffset = freeCross;
				break;
			case "center":
				alignContentStartOffset = Math.floor(freeCross / 2);
				break;
			case "space-between":
				if (wrapLines.length > 1) alignContentLineGap = crossAxisGap + Math.floor(freeCross / (wrapLines.length - 1));
				break;
			case "space-around": {
				const aroundSpace = Math.floor(freeCross / (wrapLines.length * 2));
				alignContentStartOffset = aroundSpace;
				alignContentLineGap = crossAxisGap + aroundSpace * 2;
				break;
			}
			default: if (freeCross > 0) {
				const extraPerLine = Math.floor(freeCross / wrapLines.length);
				for (const wl of wrapLines) wl.crossMax += extraPerLine;
			}
		}
	}
	crossOffset = alignContentStartOffset;
	for (let lineIdx = 0; lineIdx < wrapLines.length; lineIdx++) {
		const line = wrapLines[lineIdx];
		const lineEntries = line.entries;
		const lineCount = lineEntries.length;
		const lineCrossSize = wrap === "wrap" ? line.crossMax : crossSize;
		let lineTotalNatural = 0;
		let lineTotalFlexGrow = 0;
		let lineTotalMarginMain = 0;
		for (const entry of lineEntries) {
			lineTotalNatural += entry.natural;
			lineTotalFlexGrow += entry.flexGrow;
			lineTotalMarginMain += entry.mainMargin;
		}
		const lineGap = mainAxisGap * Math.max(0, lineCount - 1);
		const remainingSpace = mainSize - lineGap - lineTotalMarginMain - lineTotalNatural;
		if (remainingSpace >= 0 && lineTotalFlexGrow > 0) for (const entry of lineEntries) {
			if (entry.flexGrow > 0 && entry.natural === 0) entry.natural = Math.floor(entry.flexGrow / lineTotalFlexGrow * remainingSpace);
			else if (entry.flexGrow > 0) entry.natural += Math.floor(entry.flexGrow / lineTotalFlexGrow * remainingSpace);
			const cp = entry.node.props;
			const min = isColumn ? cp.minHeight : cp.minWidth;
			const max = isColumn ? cp.maxHeight : cp.maxWidth;
			entry.natural = clampSize(entry.natural, min, max);
		}
		else if (remainingSpace < 0) {
			let totalShrinkWeighted = 0;
			for (const entry of lineEntries) totalShrinkWeighted += entry.flexShrink * entry.natural;
			if (totalShrinkWeighted > 0) {
				const overflow = -remainingSpace;
				let totalShrunk = 0;
				for (const entry of lineEntries) {
					if (entry.flexShrink > 0 && entry.natural > 0) {
						const shrinkAmount = Math.floor(entry.flexShrink * entry.natural / totalShrinkWeighted * overflow);
						entry.natural = Math.max(0, entry.natural - shrinkAmount);
						totalShrunk += shrinkAmount;
					}
					const cp = entry.node.props;
					const min = isColumn ? cp.minHeight : cp.minWidth;
					const max = isColumn ? cp.maxHeight : cp.maxWidth;
					entry.natural = clampSize(entry.natural, min, max);
				}
			}
		}
		for (const entry of lineEntries) if (entry.flexGrow > 0 && entry.node.measureText && !isColumn) entry.naturalCross = entry.node.measureText(entry.natural).height + resolvePadding(entry.node.props).top + resolvePadding(entry.node.props).bottom;
		let mainOffset;
		let lineMainGap = mainAxisGap;
		const totalChildSize = lineEntries.reduce((sum, e) => sum + e.natural, 0);
		const freeSpace = mainSize - totalChildSize - lineGap - lineTotalMarginMain;
		switch (justify) {
			case "center":
				mainOffset = Math.floor(freeSpace / 2);
				break;
			case "end":
				mainOffset = freeSpace;
				break;
			case "space-between":
				mainOffset = 0;
				if (lineCount > 1) lineMainGap = mainAxisGap + Math.floor(freeSpace / (lineCount - 1));
				break;
			case "space-around": {
				const around = Math.floor(freeSpace / (lineCount * 2));
				mainOffset = around;
				lineMainGap = mainAxisGap + around * 2;
				break;
			}
			case "space-evenly": {
				const evenSpace = Math.floor(freeSpace / (lineCount + 1));
				mainOffset = evenSpace;
				lineMainGap = mainAxisGap + evenSpace;
				break;
			}
			default: mainOffset = 0;
		}
		let lineContentTotal = 0;
		for (let i = 0; i < lineEntries.length; i++) {
			const entry = lineEntries[i];
			const child = entry.node;
			const cm = entry.margin;
			const cma = entry.marginAuto;
			const mainMarginBefore = isColumn ? cm.top : cm.left;
			const mainMarginAfter = isColumn ? cm.bottom : cm.right;
			const crossMarginBefore = isColumn ? cm.left : cm.top;
			const crossMarginAfter = isColumn ? cm.right : cm.bottom;
			const mainAutoStart = isColumn ? cma.top : cma.left;
			const mainAutoEnd = isColumn ? cma.bottom : cma.right;
			const crossAutoStart = isColumn ? cma.left : cma.top;
			const crossAutoEnd = isColumn ? cma.right : cma.bottom;
			let effectiveMainMarginBefore = mainMarginBefore;
			if (mainAutoStart || mainAutoEnd) {
				const entryFreeSpace = mainSize - totalChildSize - lineGap - lineTotalMarginMain;
				if (mainAutoStart && mainAutoEnd) effectiveMainMarginBefore = Math.floor(entryFreeSpace / 2);
				else if (mainAutoStart) effectiveMainMarginBefore = entryFreeSpace;
			}
			mainOffset += effectiveMainMarginBefore;
			const selfAlign = child.props.alignSelf;
			let effectiveAlign = selfAlign !== void 0 && selfAlign !== "auto" ? selfAlign : align;
			if (isRtl && isColumn) {
				if (effectiveAlign === "start") effectiveAlign = "end";
				else if (effectiveAlign === "end") effectiveAlign = "start";
			}
			const availableCross = lineCrossSize - crossMarginBefore - crossMarginAfter;
			let childCrossSize;
			let childCrossOffset;
			const childCrossResolved = resolveSize(isColumn ? child.props.width : child.props.height, availableCross);
			if (childCrossResolved !== void 0) childCrossSize = childCrossResolved;
			else if (crossAutoStart || crossAutoEnd) {
				if (isColumn) childCrossSize = measureNaturalWidth(child, entry.natural);
				else childCrossSize = measureNaturalHeight(child, entry.natural);
				childCrossSize = Math.min(childCrossSize, availableCross);
			} else if (effectiveAlign === "stretch") childCrossSize = availableCross;
			else {
				if (isColumn) childCrossSize = measureNaturalWidth(child, entry.natural);
				else childCrossSize = measureNaturalHeight(child, entry.natural);
				childCrossSize = Math.min(childCrossSize, availableCross);
			}
			if (crossAutoStart && crossAutoEnd) childCrossOffset = crossMarginBefore + Math.floor((availableCross - childCrossSize) / 2);
			else if (crossAutoStart) childCrossOffset = crossMarginBefore + availableCross - childCrossSize;
			else if (crossAutoEnd) childCrossOffset = crossMarginBefore;
			else switch (effectiveAlign) {
				case "center":
					childCrossOffset = crossMarginBefore + Math.floor((availableCross - childCrossSize) / 2);
					break;
				case "end":
					childCrossOffset = crossMarginBefore + availableCross - childCrossSize;
					break;
				case "baseline":
					childCrossOffset = crossMarginBefore + availableCross - childCrossSize;
					break;
				default: childCrossOffset = crossMarginBefore;
			}
			const childX = isColumn ? innerX + crossOffset + childCrossOffset : innerX + mainOffset;
			const childY = isColumn ? innerY + mainOffset : innerY + crossOffset + childCrossOffset;
			const childW = isColumn ? childCrossSize : entry.natural;
			const childH = isColumn ? entry.natural : childCrossSize;
			const parentIsScroll = props.overflow === "scroll";
			const childAvailH = parentIsScroll && isColumn ? UNCONSTRAINED : childH;
			computeLayout(child, childX, childY, isColumn ? Math.max(0, childW - (parentIsScroll && isColumn ? 1 : 0)) : parentIsScroll && !isColumn ? UNCONSTRAINED : childW, isColumn ? childAvailH : childH);
			if (isRtl && !isColumn) flipXRecursive(child, innerX, innerWidth);
			const actualMainSize = isColumn ? child.layout.height : child.layout.width;
			mainOffset += actualMainSize + mainMarginAfter + lineMainGap;
			lineContentTotal += mainMarginBefore + actualMainSize + mainMarginAfter + (i < lineEntries.length - 1 ? mainAxisGap : 0);
		}
		contentTotal += lineContentTotal + (lineIdx > 0 ? crossAxisGap : 0);
		crossOffset += lineCrossSize + alignContentLineGap;
	}
	for (const child of absoluteChildren) {
		const cp = child.props;
		const explicitW = resolveSize(cp.width, innerWidth);
		const explicitH = resolveSize(cp.height, innerHeight);
		const childW = explicitW ?? measureNaturalWidth(child, innerHeight);
		const childH = explicitH ?? measureNaturalHeight(child, innerWidth);
		const clampedW = clampSize(childW, cp.minWidth, cp.maxWidth);
		const clampedH = clampSize(childH, cp.minHeight, cp.maxHeight);
		let childX;
		if (cp.left !== void 0) childX = innerX + cp.left;
		else if (cp.right !== void 0) childX = innerX + innerWidth - clampedW - cp.right;
		else childX = innerX;
		let childY;
		if (cp.top !== void 0) childY = innerY + cp.top;
		else if (cp.bottom !== void 0) childY = innerY + innerHeight - clampedH - cp.bottom;
		else childY = innerY;
		computeLayout(child, childX, childY, clampedW, clampedH);
	}
	node.layout.contentHeight = isColumn ? Math.max(contentTotal, innerHeight) : innerHeight;
	node.layout.contentWidth = isColumn ? innerWidth : Math.max(contentTotal, innerWidth);
	node.dirty = false;
	node._prevProps = props;
	node._prevWidth = availableWidth;
	node._prevHeight = availableHeight;
}
/**
* Compute the natural height of a node tree given a width constraint.
* Used for measuring content size before final layout.
*/
function measureNaturalHeight(node, availableWidth) {
	if (node.props.display === "none") return 0;
	const pad = resolvePadding(node.props);
	const margin = resolveMargin(node.props);
	const innerWidth = Math.max(0, availableWidth - pad.left - pad.right - margin.left - margin.right);
	if (node.props.flexBasis !== void 0) {
		const resolvedBasis = resolveSize(node.props.flexBasis, availableWidth);
		if (resolvedBasis !== void 0) return resolvedBasis + margin.top + margin.bottom;
	}
	if (node.measureText) return node.measureText(innerWidth).height + pad.top + pad.bottom + margin.top + margin.bottom;
	if (node.children.length === 0) return (resolveSize(node.props.height, 0) ?? pad.top + pad.bottom) + margin.top + margin.bottom;
	const isColumn = (node.props.flexDirection ?? "column") === "column";
	const rawGap = node.props.gap ?? 0;
	const gap = isColumn ? node.props.rowGap ?? rawGap : node.props.columnGap ?? rawGap;
	const visibleChildren = node.children.filter((c) => c.props.display !== "none");
	if (isColumn) {
		let total = 0;
		for (let i = 0; i < visibleChildren.length; i++) {
			total += measureNaturalHeight(visibleChildren[i], innerWidth);
			if (i < visibleChildren.length - 1) total += gap;
		}
		return total + pad.top + pad.bottom + margin.top + margin.bottom;
	}
	let maxH = 0;
	for (const child of visibleChildren) maxH = Math.max(maxH, measureNaturalHeight(child, innerWidth));
	return maxH + pad.top + pad.bottom + margin.top + margin.bottom;
}
/**
* Compute the natural width of a node tree given a height constraint.
* Used for row-direction natural sizing.
*/
function measureNaturalWidth(node, availableHeight) {
	if (node.props.display === "none") return 0;
	const pad = resolvePadding(node.props);
	const margin = resolveMargin(node.props);
	if (node.props.flexBasis !== void 0) {
		const resolvedBasis = resolveSize(node.props.flexBasis, availableHeight);
		if (resolvedBasis !== void 0) return resolvedBasis + margin.left + margin.right;
	}
	if (node.measureText) return node.measureText(UNCONSTRAINED).width + pad.left + pad.right + margin.left + margin.right;
	if (node.children.length === 0) return (resolveSize(node.props.width, 0) ?? pad.left + pad.right) + margin.left + margin.right;
	const isColumn = (node.props.flexDirection ?? "column") === "column";
	const rawGap = node.props.gap ?? 0;
	const gap = isColumn ? node.props.rowGap ?? rawGap : node.props.columnGap ?? rawGap;
	const visibleChildren = node.children.filter((c) => c.props.display !== "none");
	if (!isColumn) {
		let total = 0;
		for (let i = 0; i < visibleChildren.length; i++) {
			total += measureNaturalWidth(visibleChildren[i], availableHeight);
			if (i < visibleChildren.length - 1) total += gap;
		}
		return total + pad.left + pad.right + margin.left + margin.right;
	}
	let maxW = 0;
	for (const child of visibleChildren) maxW = Math.max(maxW, measureNaturalWidth(child, availableHeight));
	return maxW + pad.left + pad.right + margin.left + margin.right;
}
//#endregion
export { computeLayout, measureNaturalHeight, measureNaturalWidth };
