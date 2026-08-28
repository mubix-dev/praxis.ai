import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getALLConversations } from "../features/getAllConversations";
import { setConversations } from "../redux/conversationSlice";

function useGetAllConversations() {
  const dispatch = useDispatch();
  const { userData } = useSelector(state => state.user);
  useEffect(() => {
    if (!userData) return;
    const getConversations = async () => {
      const data = await getALLConversations();
      dispatch(setConversations(data));
    };

    getConversations();
  }, [userData]);
}

export default useGetAllConversations;
