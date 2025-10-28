interface PostFilterProps {
  field: string
  value: string
  onChange: (value: string) => void
}

export function PostFilter({ field, value, onChange }: PostFilterProps) {
  return (
    <div>
      <label htmlFor={`filter-${field}`}>{field}: </label>
      <input
        type='text'
        name={`filter-${field}`}
        id={`filter-${field}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
