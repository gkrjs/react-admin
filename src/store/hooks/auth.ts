import { useDispatch } from 'react-redux';
import useSWR from 'swr';

import type { Dispatch } from '../store';

export const useAuthLogin = (params: { credential: string; password: string }) => {
    const { error } = useSWR<{ token: string }>(['/api/auth', params]);
    if (error) throw new Error(error);
    const dispatch = useDispatch<Dispatch>();
};
