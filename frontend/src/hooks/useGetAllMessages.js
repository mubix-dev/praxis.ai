import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getMessages } from "../features/getMessages";
import { setMessages } from "../redux/messageSlice";

function useGetAllMessages() {
  const dispatch = useDispatch();
  const { userData } = useSelector(state => state.user);
  const {selectedConversation} = useSelector(state=>state.conversation)
  useEffect(() => {
    if (!userData) return;
    if(!selectedConversation) return
    const getALLMessages = async () => {
      const data = await getMessages(selectedConversation?._id);
      dispatch(setMessages(data));
    };

    getALLMessages();
  }, [selectedConversation]);
}

export default useGetAllMessages;
