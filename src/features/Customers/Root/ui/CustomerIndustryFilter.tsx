import { Field, NativeSelect } from '@chakra-ui/react'

import { industryTypeSchema, type IndustryType } from '@/share/types/industryType'

type CustomerIndustryFilterProps = {
  industry: IndustryType | undefined
  onIndustryChange: (industry: IndustryType | undefined) => void
}

const INDUSTRY_OPTIONS = industryTypeSchema.options
// セレクトのvalue属性は文字列しか扱えないため、「全て表示」を表す専用の値を用意する
const ALL_INDUSTRIES_VALUE = 'all'

export const CustomerIndustryFilter = ({
  industry,
  onIndustryChange,
}: CustomerIndustryFilterProps) => {
  return (
    <Field.Root width='200px'>
      <Field.Label color='gray'>Filter by Industry</Field.Label>
      <NativeSelect.Root>
        <NativeSelect.Field
          value={industry ?? ALL_INDUSTRIES_VALUE}
          onChange={(e) => {
            const value = e.target.value
            onIndustryChange(value === ALL_INDUSTRIES_VALUE ? undefined : (value as IndustryType))
          }}
        >
          <option value={ALL_INDUSTRIES_VALUE}>All Industries</option>
          {INDUSTRY_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>
    </Field.Root>
  )
}
