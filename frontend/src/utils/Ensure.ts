export const Ensure = {
  isNotNull: (object: any, objectName: string) => {
    if (object == null) {
      throw new Error(`${objectName} is null`);
    }
  },
};
