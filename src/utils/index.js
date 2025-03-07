
// Utility functions
export const GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

export const GeneratePassword = async (password, salt) => {
  return await bcrypt.hash(password, salt);
};

export const ValidatePassword = async (enteredPassword, savedPassword, salt) => {
  return (await GeneratePassword(enteredPassword, salt)) === savedPassword;
};




export const FormateData = (data) => {
  if (data) {
    return { data };
  } else {
    throw new Error("Data Not found!");
  }
};
