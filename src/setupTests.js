import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

window.HTMLElement.prototype.scrollIntoView = jest.fn();
