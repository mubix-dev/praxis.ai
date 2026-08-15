import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getMessages } from "../features/getMessages";
import { setMessages, setLoadingMessages } from "../redux/messageSlice";

function useGetAllMessages() {
  const dispatch = useDispatch();
  const { userData } = useSelector(state => state.user);
  const {selectedConversation} = useSelector(state=>state.conversation)
  const {thinking} = useSelector(state=>state.message)
  useEffect(() => {
    if (!userData) return;
    if(!selectedConversation) return
    if(thinking) return 
    const getALLMessages = async () => {
      dispatch(setLoadingMessages(true));
      const data = await getMessages(selectedConversation?._id);
      dispatch(setMessages(data));
      dispatch(setLoadingMessages(false));
    };

    getALLMessages();
  }, [selectedConversation, thinking]);
}

export default useGetAllMessages;
