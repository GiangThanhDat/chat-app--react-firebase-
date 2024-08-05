import { Input } from "components/ui/input"

const FilterInputs = ({ table, searchColumns }) => {
  const getValue = (searchColumn) => {
    return table.getColumn(searchColumn)?.getFilterValue() ?? ""
  }

  const onChange = (event, searchColumn) => {
    table.getColumn(searchColumn)?.setFilterValue(event.target.value)
  }

  return (
    <div className="flex items-center py-4 gap-x-2">
      {searchColumns.map((columnName) => {
        return (
          <Input
            placeholder={`Search ${columnName}...`}
            value={getValue(columnName)}
            onChange={(event) => onChange(event, columnName)}
            className="max-w-sm"
          />
        )
      })}
    </div>
  )
}

export default FilterInputs
