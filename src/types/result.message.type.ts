export type resultTokenMessage = {
  status: number;
  message: {
    acssesToken: string;
    refreshToken: string;
  };
};

export type resultMessage = {
  status: number;
  message: string;
};
