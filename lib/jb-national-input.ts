import CSS from "./jb-national-input.scss";
import "jb-input";
// eslint-disable-next-line no-duplicate-imports
import { JBInputWebComponent,type JBInputValue} from "jb-input";
import { type ValidationItem } from "jb-validation";
import { faToEnDigits } from "jb-core";
export * from "./types";
//TODO: add barcode scanner or nfc reader
//TODO: add showPersianNumber
export class JBNationalInputWebComponent extends JBInputWebComponent{

  constructor() {
    super();
    //to prevent initWebComponent  method override
    this.initMobileInputWebComponent();
  }
  initMobileInputWebComponent() {
    const html = `<style>${CSS}</style>`;
    const element = document.createElement("template");
    element.innerHTML = html;
    this.shadowRoot.appendChild(element.content.cloneNode(true));
    this.validation.addValidationListGetter(this.#getNationalIdValidations.bind(this));
    this.#addNationalInputEventListeners();
    this.addStandardValueCallback(this.#standardNationalIdValue.bind(this));
  }
  /**
   * @description this function will get user inputted or pasted text and convert it to standard one base on developer config
   */
  #standardNationalIdValue(valueString: string): JBInputValue {
    let displayValue = '';
    let value = '';
    // truncate value to 10 digits
    const res = /(?<nationalId>[\u06F0-\u06F90-9]{1,10})/g.exec(valueString);
    if (res && res.groups) {
      displayValue = res.groups.nationalId;
    } else {
      displayValue = '';
    }
    //convert persian number to en number
    value = faToEnDigits(displayValue);
    return { value, displayValue };
  }
  #addNationalInputEventListeners(){
    this.elements.input.addEventListener('beforeinput',this.#onNationalInputBeforeInput.bind(this));
  }
  #onNationalInputBeforeInput(e:InputEvent) {
    const inputtedText = e.data;
    const testRes = /[\u06F0-\u06F90-9]{1,10}/g.test(inputtedText);
    if (!testRes && e.inputType != 'deleteContentBackward') {
      e.preventDefault();
    }
  }
  #getNationalIdValidations():ValidationItem<JBInputValue>[]{
    function isValidIranianNationalCode(rawNationalCodeString:string){
      //check if input is valid iranian national code
      const nationalCode = faToEnDigits(rawNationalCodeString);
      if (!/^\d{10}$/.test(nationalCode)) return false;
      const check = +nationalCode[9];
      const checkNumberArr = nationalCode.split('').slice(0, 9);
      const sum = checkNumberArr.reduce((acc, x, i) => acc + +x * (10 - i), 0) % 11;
      return sum < 2 ? check === sum : check + sum === 11;
    }
    const nationalCodeValidation:ValidationItem<JBInputValue> = {
      validator:({value}) => isValidIranianNationalCode(value),
      message:'کد ملی وارد شده نامعتبر است'
    };
    return [nationalCodeValidation];
  }
}

const myElementNotExists = !customElements.get("jb-national-input");
if (myElementNotExists) {
  window.customElements.define("jb-national-input", JBNationalInputWebComponent);
}
