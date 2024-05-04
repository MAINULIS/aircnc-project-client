import { DateRange } from 'react-date-range'

const DatePicker = ({ value, handleSelect}) => {
  return (
    <DateRange
      ranges={[value]}
      onChange={handleSelect}
      rangeColors={['#262626']}
      date={new Date()}
      direction='vertical'
      showDateDisplay={false}
      minDate={value.to}
      maxDate={value.from}
    />
  )
}

export default DatePicker