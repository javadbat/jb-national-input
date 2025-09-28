import {JBDictionary} from 'jb-core/i18n';
export type JBNationalInputDictionary = {
  invalidValue:string,
}

/**
 * dictionary of jb national input. it's already loaded with persian and english lang but you can also extend it with you apps other language or replace already exist language 
 * @example 
 * ```js
 * import {dictionary} from 'jb-national-input'
 * dictionary.setLanguage("fr", {
 *  invalidValue: "message in french",
 * // other dictionary keys
 * });
 * ```
 */
export const dictionary = new JBDictionary<JBNationalInputDictionary>({
  "fa":{
    invalidValue:'کد ملی وارد شده نامعتبر است',
  },
  "en":{
    invalidValue:"The entered national code is invalid",
  }
});