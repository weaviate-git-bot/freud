/* eslint-disable react/no-array-index-key */
import { getWeeksInMonth } from '@internationalized/date';
import { useCalendarGrid } from '@react-aria/calendar';
import { useLocale } from '@react-aria/i18n';
import { CalendarState } from 'react-stately';

import { Div } from '../basic/Div';

import { CalendarCell } from './CalendarCell';

type Props = {
  state: CalendarState;
  availabilityMode: boolean;
};

export function CalendarGrid({ state, availabilityMode }: Props) {
  const { locale } = useLocale();
  const { gridProps, headerProps, weekDays } = useCalendarGrid({}, state);

  // Get the number of weeks in the month so we can render the proper number of rows.
  const weeksInMonth = getWeeksInMonth(state.visibleRange.start, locale);

  return (
    <table {...gridProps} style={{ width: '100%' }}>
      <thead {...headerProps}>
        <tr>
          {weekDays.map((day, index) => (
            <Div
              as="th"
              key={index}
              css={{
                fontWeight: '500',
                color: '$gray900',
                fontSize: '$s',
              }}
            >
              {day}
            </Div>
          ))}
        </tr>
      </thead>
      <tbody>
        {[...Array(weeksInMonth)].map((_, weekIndex) => (
          <tr key={weekIndex}>
            {state
              .getDatesInWeek(weekIndex)
              .map((date, i) =>
                date ? (
                  <CalendarCell
                    key={i}
                    state={state}
                    date={date}
                    availabilityMode={availabilityMode}
                  />
                ) : (
                  <td key={i} />
                ),
              )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
