import { useFormattedDate } from '@/hooks/use-formatted-date'

type FormattedDateCellProps = {
  date: Date
}

const FormattedDateCell = (props: FormattedDateCellProps) => {
  const { date } = props

  const formattedDate = useFormattedDate(date, {
    formatOptions: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZoneName: 'short'
    }
  })

  return formattedDate
}

export default FormattedDateCell
