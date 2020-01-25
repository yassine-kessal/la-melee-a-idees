import React, {Component} from 'react';

class Input extends Component {
  render() {
    const {errors, name, placeholder='', onChange=null, required=false, type='text', value=''} = this.props;
    const hasError = (key) => errors && errors[key] !== undefined;

    return (
      <>
        <input className={"form-control "+(hasError(name)?'is-invalid':'')} value={value} onChange={onChange} placeholder={placeholder} type={type} required={required} />
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

export default Input;