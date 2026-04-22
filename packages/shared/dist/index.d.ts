import 'react';
export interface NavSubItem {
    NAS_ID: string;
    NAS_NAME: string;
    NAS_HREF: string;
    NAS_DESC: string;
}
export interface NavItem {
    NAV_ID: string;
    NAV_NAME: string;
    NAV_IMG: string;
    NAV_DESC: string;
    NAV_SUB_MENUS: NavSubItem[];
}
export interface MenuPos {
    NAV_ID: string;
    NAS_ID: string;
    NAV_NAME: string;
    NAS_NAME: string;
    NAS_SIBLINGS: NavSubItem[];
}
export interface ColDesc {
    COL_ID: string;
    COL_NAME: string;
    COL_TYPE: string;
    COL_WIDTH?: number;
    COL_SUM?: string;
    COL_AGG?: number;
}
export interface Member {
    MEM_ID: number;
    MEM_ID_VIEW: string;
    MEM_NAME: string;
    MEM_NICKNAME: string;
    MEM_IMG: string;
    MEM_PNUMBER: string;
    MEM_EMAIL: string;
    MEM_SEX: string;
    MEM_AGE: number;
    MEM_POINT: number;
    MEM_EXP_POINT: number;
    MEM_LVL: number;
    MEM_STREAK: number;
    MES_ID: number;
    MES_NAME: string;
    MES_FEE: number;
}
export interface MemberExists {
    STATUS: string;
    ERROR: string;
    USER?: Member;
}
export interface Benefit {
    BEN_ID: string;
    BEN_NAME: string;
}
export interface Membership {
    MES_ID: number;
    MES_NAME: string;
    MES_FEE: number;
    MES_BENEFITS: Benefit[];
}
export interface MemberPlan {
    MEP_ID: number;
    MEM_ID: number;
    WOO_ID: number;
    MEP_DATE: string;
    MEP_TARGET_REPS: number;
    MEP_UNIT: string;
    MEP_ACHIEVED: 'Y' | 'N';
    MEP_DT: string;
}
export interface WorkoutRecord {
    WOR_ID: number;
    WOR_ID_VIEW: string;
    WOR_DT: Date;
    WOO_ID: number;
    WOO_NAME: string;
    WOO_NAME_COLOR: string;
    WOD_TARGET_REPS: number;
    WOD_TARGET_SETS: number;
    WOD_COUNT_P: number;
    WOD_COUNT: number;
    WOD_COUNT_S: number;
    WOD_POINT: number;
    WOR_DESC?: string;
}
export interface WorkoutHistory {
    WO_DT: string;
    STATUS: string;
}
export interface WorkoutDetail {
    WOO_ID: number;
    WOO_NAME: string;
    WOO_IMG: string;
    WOO_UNIT: string;
    WOD_GUIDE: string;
    WOD_TARGET_REPS: number;
    WOD_TARGET_SETS: number;
    WOD_COUNT: number;
    WOD_POINT: number;
    WOD_ACCURACY: number;
    WOD_TIME: number;
    WOO_TYPE: string;
}
export interface CurWorkoutRecord {
    WOR_ID: number;
    WOR_ID_VIEW: string;
}
export interface Workout {
    WOO_ID: number;
    WOO_NAME: string;
    WOO_IMG: string;
    WOO_UNIT: string;
    WOO_GUIDE: string;
    WOO_TARGET_REPS: number;
    WOO_TARGET_SETS: number;
    WOO_TYPE: string;
}
export interface RankingItem {
    RANK: number;
    MEM_ID: number;
    MEM_NAME: string;
    MEM_IMG: string;
    CNT: number;
    WORKOUT_TIME: number;
}
export interface Goods {
    GOD_ID: number;
    GOD_ID_VIEW: string;
    GOD_NAME: string;
    GOD_PRICE: number;
    GOD_DCRATE: number;
    GOD_IMG: string | null;
}
export interface WorkoutRecordWithPlan {
    WO_DT: string;
    WOO_ID: number;
    WOO_NAME: string;
    WOO_NAME_COLOR: string;
    PLAN_CNT: number;
    ACT_CNT: number;
    LEFT_CNT: number;
}
export interface T_AI_REPORT {
    AIR_ID?: number;
    AIR_ID_VIEW?: string;
    WOR_ID: number;
    AI_SUMMARY?: string | null;
    AI_RECOMMENDATIONS?: any | null;
    AI_NEXT_INTENSITY?: string | null;
    AI_RANK_PERCENT?: number | null;
    REG_DT?: Date | string;
}
export interface T_MEMBER {
    MEM_ID?: number;
    MEM_ID_VIEW: string;
    MEM_NAME: string;
    MEM_NICKNAME?: string | null;
    MEM_PASSWORD: string;
    MEM_IMG?: string | null;
    MEM_PNUMBER?: string | null;
    MEM_EMAIL?: string | null;
    MEM_SEX: string | null;
    MEM_AGE: number;
    MEM_POINT: number;
    MEM_EXP_POINT: number;
    MEM_LVL: number;
    MEM_STREAK: number;
    MES_ID: number;
}
export interface T_WORKOUT_RECORD {
    WOR_ID?: number;
    WOR_ID_VIEW: string;
    MEM_ID: number;
    WOR_DT?: string | Date | null;
    WOR_DESC?: string | null;
}
export interface T_WORKOUT_DETAIL {
    WOR_ID: number;
    WOO_ID: number;
    WOD_GUIDE?: string | null;
    WOD_TARGET_REPS: number;
    WOD_TARGET_SETS: number;
    WOD_COUNT: number;
    WOD_POINT: number;
    WOD_ACCURACY: number;
    WOD_TIME: number;
}
export interface PointHistory {
    wo_dt: Date | string;
    img: string;
    accuracy: number;
    point: number;
    title: string;
    type: 'earned' | 'used';
}
export interface Achievement {
    id: string;
    title: string;
    icon: string;
    description: string;
    progress: number;
    progressPercentage: number;
    status: 'completed' | 'inProgress' | 'locked';
    completedDate: string | null;
    points: number;
}
export interface ChartData {
    VSQL: string | null;
    DATA: any;
    COLUMNS: any;
}
export interface Postcode {
    POSTCODE: string;
    ADDRESS: string;
    ROAD_ADDRESS: string;
}
export interface MapPosition {
    LAT: number;
    LNG: number;
}
export interface BusinessTypeResult {
    NAME: string;
    FULL_CATEGORY: string;
    LEAF_CATEGORY: string;
    MAIN_CATEGORY: string;
    SUB_CATEGORY: string;
}
export interface ShopLocation {
    NAME: string;
    FULL_ADDRESS: string;
    COORDS: {
        LAT: number;
        LNG: number;
    };
    CATEGORY: string;
    MATCH_SCORE: number;
}
declare module 'express-session' {
    interface SessionData {
        user: Member | null;
        isLogined: boolean;
    }
}
