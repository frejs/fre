import { h } from "../../../src/index"
import App from './App';
import {hydrate} from "../../../src";

hydrate(<App />, document.getElementById('app'));
