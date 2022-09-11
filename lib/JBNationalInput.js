import HTML from './JBNationalInput.html';
import CSS from './JBNationalInput.scss';
import 'jb-input';


class JBNationalInputWebComponent extends HTMLElement {
    #disabled = false;
    static get formAssociated() { return true; }
    #value = '';
    get value() {
        return this.#value;
    }
    set value(newValue) {
        const { displayValue, value } = this.standardValue(newValue);
        this.#value = value;
        this.elements.input.value = displayValue;
    }
    #nationalCodeValidation = {
        validator:(value) => this.isValidIranianNationalCode(value),
        message:'کد ملی وارد شده نامعتبر است'
    }
    #validationList = [this.#nationalCodeValidation];
    get validationList() {
        return this.#validationList;
    }
    set validationList(value) {
        if (Array.isArray(value)) {
            this.#validationList = [this.#nationalCodeValidation, ...value];
            this.elements.input.validationList = this.#validationList;
        }
    }
    constructor() {
        super();
        if (typeof this.attachInternals == "function") {
            //some browser dont support attachInternals
            this.internals_ = this.attachInternals();
        }
        this.initWebComponent();
    }
    connectedCallback() {
        // standard web component event that called when all of dom is binded
        this.callOnLoadEvent();
        this.initProp();
        this.callOnInitEvent();

    }
    callOnLoadEvent() {
        var event = new CustomEvent('load', { bubbles: true, composed: true });
        this.dispatchEvent(event);
    }
    callOnInitEvent() {
        var event = new CustomEvent('init', { bubbles: true, composed: true });
        this.dispatchEvent(event);
    }
    initWebComponent() {
        const shadowRoot = this.attachShadow({
            mode: 'open',
            delegatesFocus: true,
        });
        const html = `<style>${CSS}</style>` + '\n' + HTML;
        const element = document.createElement('template');
        element.innerHTML = html;
        shadowRoot.appendChild(element.content.cloneNode(true));
        this.elements = {
            input: shadowRoot.querySelector('jb-input'),
        };
        this.registerEventListener();
    }
    /**
     * 
     * @param {string} rawText 
     * @return {string} 
     */
    getUnformattedValue(rawText) {
        if (this.inputType == InputTypes.CardNumber) {
            let val = rawText.replace(/\s/g, '').replace(/[^0-9]/g, '');
            val = val.substring(0, 16);
            return val;
        }
        if (this.inputType == InputTypes.ShabaNumber) {
            const seprator = /(?<ir>(IR|ir|Ir|I|i)?)(?<other>.{0,})/g.exec(rawText);
            if (seprator && seprator.groups) {

                let numberPart = seprator.groups.other.replace(/\s/g, '').replace(/[^0-9]/g, '');
                numberPart = numberPart.substring(0, 24);
                //manage ir part
                let irPart
                if (seprator.groups.ir) {
                    irPart = seprator.groups.ir.toUpperCase();
                } else {
                    // if user input some number without ir part we add it ourselves
                    if (numberPart.length > 0) {
                        irPart = 'IR';
                    } else {
                        //if user input no ir part and no valid number part we return empty string
                        return ''
                    }
                }
                if (irPart.length == 1) {
                    return irPart;
                }
                return irPart + numberPart;
            } else {
                return '';
            }
        }
        return rawText;
    }
    /**
     * this function will get user inputed or pasted text and convert it to standard one base on developer config
     * @param {String} valueString 
     * @return {{displayValue: String, value: String}} standard value
     */
    standardValue(valueString) {
        let displayValue = '';
        let value = '';
        // truncate value to 10 digits
        const res = /(?<nationalId>[\u06F0-\u06F90-9]{1,10})/g.exec(valueString)
        if (res && res.groups) {
            displayValue = res.groups.nationalId;
        } else {
            displayValue = '';
        }
        //convert perian number to en number
        value = displayValue.replace(/\u06F0/g, '0').replace(/\u06F1/g, '1').replace(/\u06F2/g, '2').replace(/\u06F3/g, '3').replace(/\u06F4/g, '4').replace(/\u06F5/g, '5').replace(/\u06F6/g, '6').replace(/\u06F7/g, '7').replace(/\u06F8/g, '8').replace(/\u06F9/g, '9');
        return { displayValue, value }
    }

    registerEventListener() {
        this.elements.input.addEventListener('change', this.onInputChange.bind(this));
        this.elements.input.addEventListener('keypress', this.onInputKeyPress.bind(this));
        this.elements.input.addEventListener('keyup', this.onInputKeyup.bind(this));
        this.elements.input.addEventListener('keydown', this.onInputKeyDown.bind(this));
        this.elements.input.addEventListener('input', this.onInputInput.bind(this));
        this.elements.input.addEventListener('init', this.onInputInit.bind(this));
        this.elements.input.addEventListener('beforeinput', this.onInputBeforeInput.bind(this));
    }
    initProp() {
        this.#disabled = false;
        this.value = this.getAttribute('value') || '';
        this.validation = {
            isValid: null,
            message: null
        };
    }
    static get observedAttributes() {
        return ['label', 'message', 'value', 'name', 'autocomplete', 'placeholder', 'disabled', 'inputmode'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        // do something when an attribute has changed
        this.onAttributeChange(name, newValue);
    }
    onAttributeChange(name, value) {
        switch (name) {
            case 'label':
                this.elements.input.setAttribute('label', value);
                break;
            case 'message':
                this.elements.input.setAttribute('message', value);
                break;
            case 'value':
                this.value = value;
                break;
            case 'name':
                this.elements.input.setAttribute('name', value);
                break;
            case 'autocomplete':
                this.elements.input.setAttribute('autocomplete', value);
                break;
            case 'placeholder':
                this.elements.input.setAttribute('placeholder', value);
                break;
            case 'disabled':
                if (value == '' || value === "true") {
                    this.#disabled = true;
                    this.elements.input.setAttribute('disabled', 'true');
                } else if (value == "false") {
                    this.#disabled = false;
                    this.elements.input.removeAttribute('disabled');
                }
                break;
            case 'inputmode':
                this.elements.input.setAttribute("inputmode", value);

        }

    }

    /**
     * 
     * @param {KeyboardEvent} e 
     */
    onInputKeyDown(e) {
        //trigger componnet event
        const keyDownnInitObj = {
            key: e.key,
            keyCode: e.keyCode,
            code: e.code,
            ctrlKey: e.ctrlKey,
            shiftKey: e.shiftKey,
            altKey: e.altKey,
            charCode: e.charCode,
            which: e.which
        };
        const event = new KeyboardEvent("keydown", keyDownnInitObj);
        this.dispatchEvent(event);
    }
    /**
     * 
     * @param {InputEvent} e 
     */
    onInputInput(e) {
        const inputedText = e.target.value;
        this.value = inputedText;
        e.preventDefault();
        this.dispatchInputEvent(e);
    }
    onInputInit(){
        this.elements.input.validationList = this.validationList;
    }
    dispatchInputEvent(e) {
        const eventInitDict = {
            bubbles: e.bubbles,
            cancelable: e.cancelable,
            composed: e.composed,
            data: e.data,
            isComposing: e.isComposing,
            inputType: e.inputType,
            dataTransfer: e.dataTransfer,
            view: e.view,
            detail: e.detail,
            key: e.key,
        };
        const event = new InputEvent('input', eventInitDict);
        this.dispatchEvent(event);
    }
    /**
    * 
    * @param {InputEvent} e
    */
    onInputBeforeInput(e) {
        const inputedText = e.data;
        const testRes = /[\u06F0-\u06F90-9]{1,10}/g.test(inputedText);
        if (!testRes && e.inputType != 'deleteContentBackward') {
            e.preventDefault();
        }
        this.dispatchBeforeInputEvent(e);
    }
    dispatchBeforeInputEvent(e) {
        const eventInitDict = {
            bubbles: e.bubbles,
            cancelable: e.cancelable,
            composed: e.composed,
            data: e.data,
            isComposing: e.isComposing,
            inputType: e.inputType,
            dataTransfer: e.dataTransfer,
            view: e.view,
            detail: e.detail,
            key: e.key,
        };
        const event = new InputEvent('beforeinput', eventInitDict);
        this.dispatchEvent(event);
    }
    onInputKeyPress(e) {
        //TODO: raise keypress event
        const event = new CustomEvent('keypress');
        this.dispatchEvent(event);
    }
    onInputKeyup(e) {
        this.triggerInputValidation(false);
        const keyUpInitObj = {
            key: e.key,
            keyCode: e.keyCode,
            code: e.code,
            ctrlKey: e.ctrlKey,
            shiftKey: e.shiftKey,
            altKey: e.altKey,
            charCode: e.charCode,
            which: e.which,
        };
        const event = new KeyboardEvent('keyup', keyUpInitObj);
        this.dispatchEvent(event);
        if (e.keyCode == 13) {
            this.onInputEnter();
        }
    }
    onInputEnter() {
        const event = new CustomEvent('enter');
        this.dispatchEvent(event);
    }
    onInputChange(e) {
        this.triggerInputValidation(true);
        //here is the rare  time we update _value directly becuase we want trigger event that may read value directly from dom
        this.dispatchOnChangeEvent();
    }
    dispatchOnChangeEvent() {
        const validationObject = this.elements.input.checkInputValidation(this.value);
        const event = new CustomEvent('change', {
            detail: {
                isValid: validationObject.isAllValid,
                validationObject: validationObject,
            },
        });
        this.dispatchEvent(event);
    }
    triggerInputValidation(showError = true) {
        return this.elements.input.triggerInputValidation(showError);
    }
    /**
     * @public
     */
    focus() {
        //public method
        this.elements.input.focus();
    }
    isValidIranianNationalCode(rawNationalCodeString) {
        //check if input is valid iranian national code
        const nationalCode = this.convertFaToEnDigits(rawNationalCodeString);
        if (!/^\d{10}$/.test(nationalCode)) return false;
        const check = +nationalCode[9];
        const checkNumberArr = nationalCode.split('').slice(0, 9);
        const sum = checkNumberArr.reduce((acc, x, i) => acc + +x * (10 - i), 0) % 11;
        return sum < 2 ? check === sum : check + sum === 11;
    }
    convertFaToEnDigits(input) {
        if (typeof input !== "string"){
            return '';
        }
        const regex = /[۰-۹]/g;
        let result = input.replace(regex, function (w) {
            return String.fromCharCode(w.charCodeAt(0) - 1728);
        }
        );
        return result;
    }
}
const myElementNotExists = !customElements.get('jb-national-input');
if (myElementNotExists) {
    window.customElements.define('jb-national-input', JBNationalInputWebComponent);
}
