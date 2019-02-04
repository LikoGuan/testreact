import React from 'react';
import Input from 'react-toolbox/lib/input/Input';
import DatePicker from 'react-toolbox/lib/date_picker/DatePicker';
import AutoComplete from '../components/AutoComplete';
import Dropdown from 'react-toolbox/lib/dropdown';
import Switch from 'react-toolbox/lib/switch/Switch';
import Checkbox from 'react-toolbox/lib/checkbox/Checkbox';
import { stringToBoolean,getSourceForAutoComplete,getSourceForDropdown} from '../util';

export const renderCheckbox = ({ input, label, disabled, meta: { touched, error, warning, dirty, active } }) =>
  <div>
    <Checkbox {...input} label={label} disabled={disabled} checked={stringToBoolean(input.value)} />
  </div>;

export const renderSwitch = ({ input, label, disabled, meta: { touched, error, warning, dirty, active } }) =>
  <div>
    <Switch {...input} label={label} disabled={disabled} checked={stringToBoolean(input.value)} />
  </div>;

export const renderInput = ({ input, label, type, disabled, step, meta: { touched, error, warning, dirty, active } }) =>
  <div>
    <Input {...input} type={type} label={label} step={step} disabled={disabled}
           error={touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}/>
  </div>;

export const renderDatePicker = ({input, label, autoOk = false, meta: { touched, error, warning, dirty, active },}) => {
  return (
    <div>
      <DatePicker {...input} label={label} autoOk={autoOk}/>
    </div>
  );
};


export const renderAutoComplete = ({
  input,
  label,
  multiple = false,
  isUseLabelsAsKeys = false,
  isOptional = false,
  showSelectedWhenNotInSource = false ,
  showSuggestionsWhenValueIsSet = false,
  source,
  meta: { touched, error, warning, dirty, active },
}) => {
  return ( // multiple is naturally nullable
    <div>
      <AutoComplete {...input}
                    source={getSourceForAutoComplete(source,isUseLabelsAsKeys,isOptional)}
                    label={label}
                    showSelectedWhenNotInSource={showSelectedWhenNotInSource}
                    showSuggestionsWhenValueIsSet={showSuggestionsWhenValueIsSet}
                    multiple={multiple}
                    isUseLabelsAsKeys={isUseLabelsAsKeys}/>
    </div>
  );
};


export const renderDropdown = ({
                                 input: {name, value, onChange},
                                 source,
                                 disabled,
                                 isUseLabelsAsKeys,
                                 isOptional = false,
                                 label,
                                 meta: { touched, error, warning, dirty, active }
}) =>
  <div>
    <Dropdown {...{name, value, onChange}} label={label} source={getSourceForDropdown(source,isUseLabelsAsKeys,isOptional)} disabled={disabled} />
  </div>;