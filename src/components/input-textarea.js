import React, {Component} from 'react';

class InputTextarea extends Component {
  render() {
    const {errors, name, placeholder='', onChange=null, required=false, value=''} = this.props;
    const hasError = (key) => errors && errors[key] !== undefined;

    return (
      <>
        <textarea className={"form-control "+(hasError(name)?'is-invalid':'')} onChange={onChange} placeholder={placeholder} required={required}>{value}</textarea>
        {hasError(name)
        &&
        <div className="invalid-feedback">
          {typeof errors[name] === "string"
            ?
            errors[name]
            :
            errors[name].map((value,i) => (
                <span key={i}>{value}<br /></span>
              )
          )}
        </div>}
      </>
    );
  }
}

export default InputTextarea;