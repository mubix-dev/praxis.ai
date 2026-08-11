import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import getCurrentUser from "../features/getCurrentUser";
import { useEffect } from "react";

function useGetCurrUser() {
    const dispatch = useDispatch()
  useEffect(() => {
    const getUser = async () => {
      const data = await getCurrentUser();
        dispatch(setUserData(data))
        
    };

    getUser();
  }, []);
}

export default useGetCurrUser;
