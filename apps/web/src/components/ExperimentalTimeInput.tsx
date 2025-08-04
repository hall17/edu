{
  /* <div className="border-border focus-within:ring-ring flex items-center rounded-lg border focus-within:ring-1">
<Input
  type="number"
  min="0"
  max="23"
  value={startHour.padStart(2, '0')}
  className="bg-background w-10 [appearance:textfield] border-none !px-0 text-center shadow-none !ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
  onChange={(e) => {
    console.log(
      'e.target.value',
      startHour,
      e.target.value,
      e.target.selectionStart,
      e.target.selectionDirection,
      e.target.selectionEnd
    );
    return;
    const value = parseInt(e.target.value);
    if (value >= 0 && value <= 23) {
      e.target.value = value.toString().padStart(2, '0');
    }
  }}
  onBlur={(e) => {
    const value = parseInt(e.target.value) || 0;
    e.target.value = Math.min(Math.max(value, 0), 23)
      .toString()
      .padStart(2, '0');
  }}
/>
<span className="text-muted-foreground">:</span>
<Input
  type="number"
  min="0"
  max="59"
  value={startMinute.padStart(2, '0')}
  className="bg-background w-10 [appearance:textfield] border-none !px-0 text-center shadow-none !ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
  onChange={(e) => {
    console.log('e.target.value', e.target.value);
    return;
    const value = parseInt(e.target.value);
    if (value >= 0 && value <= 59) {
      e.target.value = value.toString().padStart(2, '0');
    }
  }}
  onBlur={(e) => {
    const value = parseInt(e.target.value) || 0;
    e.target.value = Math.min(Math.max(value, 0), 59)
      .toString()
      .padStart(2, '0');
  }}
/>
</div> */
}

export function ExperimentalTimeInput() {
  return null;
}
