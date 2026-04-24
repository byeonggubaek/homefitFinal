import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// javascript의 fetch API를 사용하여 GET 요청을 보내는 함수입니다.
export async function apiGet(path: string, query = {}) {
  const queryString = new URLSearchParams(query).toString();
  const url = queryString
    ? `${BACKEND_URL}${path}?${queryString}`
    : `${BACKEND_URL}${path}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`API 요청 실패: ${res.status}`);
  }

  return res.json();
}
export async function apiPost(path: string, body: any, headers = {}) {
  const url = `${BACKEND_URL}${path}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`API 요청 실패: ${res.status}`);
  }
  return res.json();
}

// axios를 사용하여 POST 요청을 보내는 함수입니다.
const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

// 로그인 
export const loginMember = async (
  LoginParams:
  { mem_id_act : string, 
    mem_password : string }
) => {
  const response = await api.post(
    '/api/member/login', 
    LoginParams
  );

  return response.data;
};
export const logoutMember = async () => {
  const response = await api.post(
    '/api/member/logout',
    {}
 );

  return response.data;
};
// 운동
export const getWorkoutList = async () => {
  const res = await api.get(
    '/api/workout/getWorkouts'
  );
  return res.data;
};
// 멤버쉽
export const getMonthlyMemberPlan = async (
  memberId: number | string,
  month: string
) => {
  const res = await api.get(
    '/api/member/getMonthlyMemberPlan',
    {
      params: { memberId, month },
    }
  );

  return res.data;
};
export const getMemberPlan = async (memberId: string | number, date: string) => {
  const res = await api.get(
    '/api/member/getMemberPlan', 
    {
      params: {
        memberId,
        date,
      },
    }
  );
  return res.data;
};
export const getMemberships = async () => {
  const response = await api.get(
    '/api/member/getMemberships'
  );
  return response.data;
};
export const insertMemberPlan = async (
  newPlan: {
    MEM_ID: number | string;
    WOO_ID: number;
    MEP_DATE: string;
    MEP_TARGET_REPS: number;
    MEP_TARGET_SETS: number;
    MEP_UNIT: string;
  }
) => {
  const res = await api.post(
    '/api/member/insertMemberPlan',
    newPlan
  );

  return res.data;
};
export const deleteMemberPlan = async (goalId: number | string) => {
  const res = await api.delete(
    '/api/member/deleteMemberPlan',
    {
      params: { goalId },
    }
  );

  return res.data;
};
// 회원정보 
export const editMemberProfile = async ({
  nickname,
  pnumber,
  img,
}: {
  nickname: string;
  pnumber: string;
  img: string;
}) => {
  const response = await api.post(
    '/api/member/edit',
    { nickname, pnumber, img }
  );

  return response.data;
};
export const checkPassword = async (password: string) => {
  const response = await api.post(
    '/api/member/pwcheck',
    { password }
  );

  return response.data;
};
export const signupMember = async (data: any) => {
  const response = await api.post(
    '/api/member/signup',
    data
  );

  return response.data;
};
export const getMyMember = async () => {
  const response = await api.get('/api/member/me');

  return response.data;
};