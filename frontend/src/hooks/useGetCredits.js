import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getCredits } from "../features/getCredits";
import { setCredits } from "../redux/userSlice";

function useGetCredits() {
  const dispatch = useDispatch();
  const { userData } = useSelector(state => state.user);
  useEffect(() => {
    if (!userData) return;
    const getUserCredits = async () => {
      const data = await getCredits();
      console.log(data)
      dispatch(setCredits(data?.credits))
    };

    getUserCredits();
  }, [userData]);
}

export default useGetCredits;
