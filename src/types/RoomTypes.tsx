export type TRoom = {
  id?: string;
  roomName: string;
  roomCode: string;
  location: string;
  capacity?: number;
  description?: string;
};

export type TRoomList = TRoom & { id: string };