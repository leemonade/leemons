async function getSystemDataFieldsConfig({ ctx }) {
  const data = await ctx.tx.db.Config.findOne({ key: 'SystemDataFields' });
  const result = {
    avatar: { required: false, disabled: false },
    secondSurname: { required: false, disabled: false },
  };
  if (data) {
    const value = JSON.parse(data.value);
    if (value.avatar) {
      result.avatar.required = value.avatar.required || false;
      result.avatar.disabled = value.avatar.disabled || false;
    }
    if (value.secondSurname) {
      result.secondSurname.required = value.secondSurname.required || false;
      result.secondSurname.disabled = value.secondSurname.disabled || false;
    }
  }
  return result;
}

module.exports = getSystemDataFieldsConfig;
