

const Component = ({ value }) => <input value={value}/>

const div = <Component value={"foo"}>bar</Component>

console.log(div)