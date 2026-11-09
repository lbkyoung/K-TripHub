'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '@/lib/types';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  signInWithPopup,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '@/lib/firebase';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  modalInitialTab: 'login' | 'register';
  modalInitialRole: 'TOURIST' | 'AGENCY';
  openAuthModal: (tab?: 'login' | 'register', role?: 'TOURIST' | 'AGENCY') => void;
  closeAuthModal: () => void;
  login: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  loginWithSocial: (provider: 'google' | 'kakao') => Promise<{ success: boolean; message?: string }>;
  registerTourist: (data: { email: string; name: string; pass: string }) => Promise<{ success: boolean; message?: string }>;
  registerAgency: (data: {
    email: string;
    pass: string;
    name: string;
    agencyName: string;
    businessNumber: string;
    phoneNumber: string;
    documentFileName?: string;
  }) => Promise<{ success: boolean; message?: string }>;
  quickLoginAs: (role: UserRole) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 플랫폼 총괄 관리자(Admin) 권한 보유자 이메일 목록
export const ADMIN_EMAILS = [
  'admin@ktriphub.com',
  'lbkyoung5688@gmail.com',
];

export function checkIsAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const clean = email.toLowerCase().trim();
  return ADMIN_EMAILS.includes(clean);
}

// 파이어베이스 에러 코드 한국어 친화적 변환 함수
function formatFirebaseAuthError(error: any): string {
  const code = error?.code || '';
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return '이메일 또는 비밀번호가 올바르지 않습니다. 다시 확인해 주세요.';
    case 'auth/email-already-in-use':
      return '이미 가입된 이메일 주소입니다. 로그인 탭에서 로그인해 주세요.';
    case 'auth/weak-password':
      return '비밀번호는 최소 6자리 이상으로 설정해 주세요.';
    case 'auth/invalid-email':
      return '올바른 형식의 이메일 주소를 입력해 주세요.';
    case 'auth/operation-not-allowed':
      return '파이어베이스 콘솔에서 이메일/비밀번호 로그인이 활성화되지 않았습니다. [Firebase Console > Authentication > Sign-in method]에서 이메일/비밀번호를 사용 설정해 주세요.';
    case 'auth/too-many-requests':
      return '비정상적인 요청이 많아 일시적으로 차단되었습니다. 잠시 후 다시 시도해 주세요.';
    case 'auth/network-request-failed':
      return '네트워크 연결 상태를 확인해 주세요.';
    case 'auth/popup-closed-by-user':
      return '소셜 로그인 팝업 창이 닫혔습니다.';
    case 'auth/unauthorized-domain':
      return '현재 도메인(localhost 등)이 파이어베이스 승인 도메인(Authorized Domains)에 등록되어 있지 않습니다.';
    default:
      return error?.message || '인증 처리 중 오류가 발생했습니다.';
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [modalInitialTab, setModalInitialTab] = useState<'login' | 'register'>('login');
  const [modalInitialRole, setModalInitialRole] = useState<'TOURIST' | 'AGENCY'>('TOURIST');

  // Firebase Auth 상태 실시간 감지 및 자동 로그인 복원
  useEffect(() => {
    // 1) 로컬 스토리지에 캐시된 세션 우선 로드 (관리자 이메일이면 즉시 ADMIN으로 승격)
    try {
      const savedUserStr = localStorage.getItem('k_trip_hub_current_user');
      if (savedUserStr) {
        const savedUser: UserProfile = JSON.parse(savedUserStr);
        if (checkIsAdminEmail(savedUser.email) && savedUser.role !== 'ADMIN') {
          savedUser.role = 'ADMIN';
          savedUser.name = '플랫폼 총괄 관리자';
          savedUser.isVerified = true;
          localStorage.setItem('k_trip_hub_current_user', JSON.stringify(savedUser));
        }
        setUser(savedUser);
      }
    } catch (e) {
      console.error(e);
    }

    // 2) Firebase Authentication 리스너 연결
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          // Firestore에서 추가 프로필(role, agency 정보 등) 조회
          const userEmail = (firebaseUser.email || '').toLowerCase().trim();
          const isAdmin = checkIsAdminEmail(userEmail);
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const data = userDoc.data();
            const role: UserRole = (isAdmin || data.role === 'ADMIN') ? 'ADMIN' : (data.role || 'TOURIST');
            // 기존 관광객으로 등록되었더라도 관리자 이메일이면 Firestore 권한 즉시 ADMIN으로 자동 승격
            if (isAdmin && data.role !== 'ADMIN') {
              try {
                await setDoc(userDocRef, { ...data, role: 'ADMIN', isVerified: true }, { merge: true });
              } catch (e) {
                console.warn('[Firestore] 관리자 권한 자동 승격 경고:', e);
              }
            }
            const profile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: data.name || (role === 'ADMIN' ? '플랫폼 총괄 관리자' : (firebaseUser.displayName || '회원')),
              role,
              phoneNumber: data.phoneNumber,
              agencyName: data.agencyName,
              businessNumber: data.businessNumber,
              documentFileName: data.documentFileName,
              isVerified: data.isVerified ?? (role === 'ADMIN' ? true : false),
              createdAt: data.createdAt || new Date().toISOString().split('T')[0],
            };
            setUser(profile);
            localStorage.setItem('k_trip_hub_current_user', JSON.stringify(profile));
          } else {
            // Firestore에 문서가 없으면 기본 프로필 구성 (관리자 이메일이면 ADMIN)
            const role: UserRole = isAdmin ? 'ADMIN' : 'TOURIST';
            const profile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: role === 'ADMIN' ? (firebaseUser.displayName || '플랫폼 총괄 관리자') : (firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '관광객'),
              role,
              isVerified: role === 'ADMIN' ? true : false,
              createdAt: new Date().toISOString().split('T')[0],
            };
            try {
              await setDoc(userDocRef, profile);
            } catch (e) {
              console.warn('[Firestore] 관리자 프로필 생성 경고:', e);
            }
            setUser(profile);
            localStorage.setItem('k_trip_hub_current_user', JSON.stringify(profile));
          }
        } catch (err) {
          console.warn('[Firebase Auth] Firestore 연동 조회 경고 (Auth 세션은 유지됨):', err);
        }
      } else {
        // Firebase 로그아웃 상태일 때
        setUser(null);
        localStorage.removeItem('k_trip_hub_current_user');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const openAuthModal = (tab: 'login' | 'register' = 'login', role: 'TOURIST' | 'AGENCY' = 'TOURIST') => {
    setModalInitialTab(tab);
    setModalInitialRole(role);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);

  // 파이어베이스 실제 비밀번호 검증 로그인 (바이패스 없는 안전한 인증)
  const login = async (email: string, pass: string): Promise<{ success: boolean; message?: string }> => {
    const trimmedEmail = email.trim();

    // 실제 Firebase Authentication 로그인 실행 (비밀번호 반드시 일치해야 함)
    try {
      const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, pass);
      const firebaseUser = userCredential.user;

      const userEmail = (firebaseUser.email || trimmedEmail).toLowerCase().trim();
      const isAdmin = checkIsAdminEmail(userEmail);
      let profile: UserProfile;
      try {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const d = userDoc.data();
          const role: UserRole = (isAdmin || d.role === 'ADMIN') ? 'ADMIN' : (d.role || 'TOURIST');
          if (isAdmin && d.role !== 'ADMIN') {
            try {
              await setDoc(doc(db, 'users', firebaseUser.uid), { ...d, role: 'ADMIN', isVerified: true }, { merge: true });
            } catch (e) {
              console.warn('[Firestore] 관리자 권한 자동 승격 경고:', e);
            }
          }
          profile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || trimmedEmail,
            name: d.name || firebaseUser.displayName || (role === 'ADMIN' ? '플랫폼 총괄 관리자' : '회원'),
            role,
            phoneNumber: d.phoneNumber,
            agencyName: d.agencyName,
            businessNumber: d.businessNumber,
            documentFileName: d.documentFileName,
            isVerified: d.isVerified ?? (role === 'ADMIN' ? true : false),
            createdAt: d.createdAt || new Date().toISOString().split('T')[0],
          };
        } else {
          // Firestore 문서가 아직 생성되지 않은 경우 (콘솔에서 직접 Auth 생성 시)
          const role: UserRole = isAdmin ? 'ADMIN' : 'TOURIST';
          profile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || trimmedEmail,
            name: firebaseUser.displayName || (role === 'ADMIN' ? '플랫폼 총괄 관리자' : trimmedEmail.split('@')[0]),
            role,
            isVerified: role === 'ADMIN' ? true : false,
            createdAt: new Date().toISOString().split('T')[0],
          };
          try {
            await setDoc(doc(db, 'users', firebaseUser.uid), profile);
          } catch (e) {
            console.warn('[Firestore] 프로필 동기화 경고:', e);
          }
        }
      } catch {
        const role: UserRole = isAdmin ? 'ADMIN' : 'TOURIST';
        profile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || trimmedEmail,
          name: firebaseUser.displayName || (role === 'ADMIN' ? '플랫폼 총괄 관리자' : trimmedEmail.split('@')[0]),
          role,
          isVerified: role === 'ADMIN' ? true : false,
          createdAt: new Date().toISOString().split('T')[0],
        };
      }

      setUser(profile);
      localStorage.setItem('k_trip_hub_current_user', JSON.stringify(profile));
      closeAuthModal();
      return { success: true };
    } catch (firebaseErr: any) {
      console.warn('[Firebase Auth] 로그인 오류 발생:', firebaseErr);
      return {
        success: false,
        message: formatFirebaseAuthError(firebaseErr),
      };
    }
  };

  // 파이어베이스 소셜 로그인 (구글 팝업 연동)
  const loginWithSocial = async (provider: 'google' | 'kakao'): Promise<{ success: boolean; message?: string }> => {
    if (provider === 'google') {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const firebaseUser = result.user;

        const userEmail = (firebaseUser.email || '').toLowerCase().trim();
        const isAdmin = checkIsAdminEmail(userEmail);
        let profile: UserProfile;
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const d = userDoc.data();
            const role: UserRole = (isAdmin || d.role === 'ADMIN') ? 'ADMIN' : (d.role || 'TOURIST');
            if (isAdmin && d.role !== 'ADMIN') {
              try {
                await setDoc(doc(db, 'users', firebaseUser.uid), { ...d, role: 'ADMIN', isVerified: true }, { merge: true });
              } catch (e) {
                console.warn('[Firestore] 관리자 권한 자동 승격 경고:', e);
              }
            }
            profile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: d.name || (role === 'ADMIN' ? '플랫폼 총괄 관리자' : (firebaseUser.displayName || 'Google Traveler')),
              role,
              phoneNumber: d.phoneNumber,
              agencyName: d.agencyName,
              businessNumber: d.businessNumber,
              documentFileName: d.documentFileName,
              isVerified: d.isVerified ?? (role === 'ADMIN' ? true : false),
              createdAt: d.createdAt || new Date().toISOString().split('T')[0],
            };
          } else {
            const role: UserRole = isAdmin ? 'ADMIN' : 'TOURIST';
            profile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: role === 'ADMIN' ? (firebaseUser.displayName || '플랫폼 총괄 관리자') : (firebaseUser.displayName || 'Google Traveler'),
              role,
              isVerified: role === 'ADMIN' ? true : false,
              createdAt: new Date().toISOString().split('T')[0],
            };
            await setDoc(doc(db, 'users', firebaseUser.uid), profile);
          }
        } catch {
          const role: UserRole = isAdmin ? 'ADMIN' : 'TOURIST';
          profile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: role === 'ADMIN' ? (firebaseUser.displayName || '플랫폼 총괄 관리자') : (firebaseUser.displayName || 'Google Traveler'),
            role,
            isVerified: role === 'ADMIN' ? true : false,
            createdAt: new Date().toISOString().split('T')[0],
          };
        }

        setUser(profile);
        localStorage.setItem('k_trip_hub_current_user', JSON.stringify(profile));
        closeAuthModal();
        return { success: true };
      } catch (err: any) {
        console.error('[Firebase Google Login Error]:', err);
        return {
          success: false,
          message: formatFirebaseAuthError(err),
        };
      }
    } else {
      // 카카오 간편 로그인 시뮬레이션
      const u: UserProfile = {
        uid: `kakao-${Date.now()}`,
        email: `kakao_traveler@ktriphub.com`,
        name: '카카오 관광객',
        role: 'TOURIST',
        createdAt: new Date().toISOString().split('T')[0],
      };
      setUser(u);
      localStorage.setItem('k_trip_hub_current_user', JSON.stringify(u));
      closeAuthModal();
      return { success: true };
    }
  };

  // 파이어베이스 일반 관광객 회원가입 (관리자 이메일 가입 시 최고 관리자로 자동 등록)
  const registerTourist = async (data: { email: string; name: string; pass: string }): Promise<{ success: boolean; message?: string }> => {
    try {
      const trimmedEmail = data.email.trim();
      const isAdmin = checkIsAdminEmail(trimmedEmail);

      // 1. Firebase Auth에 이메일/비밀번호로 사용자 생성
      const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, data.pass);
      const firebaseUser = userCredential.user;

      // 2. 프로필 표시 이름(displayName) 업데이트
      const displayName = isAdmin ? '플랫폼 총괄 관리자' : data.name;
      await updateProfile(firebaseUser, { displayName });

      // 3. Firestore 'users' 컬렉션에 사용자 데이터 문서 저장
      const newProfile: UserProfile = {
        uid: firebaseUser.uid,
        email: trimmedEmail,
        name: displayName,
        role: isAdmin ? 'ADMIN' : 'TOURIST',
        isVerified: isAdmin ? true : false,
        createdAt: new Date().toISOString().split('T')[0],
      };

      try {
        await setDoc(doc(db, 'users', firebaseUser.uid), newProfile);
      } catch (dbErr) {
        console.warn('[Firestore] 프로필 저장 경고:', dbErr);
      }

      saveUserToLocal(newProfile);
      setUser(newProfile);
      localStorage.setItem('k_trip_hub_current_user', JSON.stringify(newProfile));
      closeAuthModal();
      return { success: true };
    } catch (firebaseErr: any) {
      console.error('[Firebase Auth] 회원가입 에러:', firebaseErr);
      return {
        success: false,
        message: formatFirebaseAuthError(firebaseErr),
      };
    }
  };

  // 파이어베이스 여행사 파트너 회원가입
  const registerAgency = async (data: {
    email: string;
    pass: string;
    name: string;
    agencyName: string;
    businessNumber: string;
    phoneNumber: string;
    documentFileName?: string;
  }): Promise<{ success: boolean; message?: string }> => {
    try {
      // 1. Firebase Auth 계정 생성
      const userCredential = await createUserWithEmailAndPassword(auth, data.email.trim(), data.pass);
      const firebaseUser = userCredential.user;

      // 2. 표시 이름 업데이트
      await updateProfile(firebaseUser, { displayName: data.name });

      // 3. Firestore 'users' 컬렉션에 여행사 프로필 저장 (관리자 승인 대기 isVerified: false)
      const newAgencyProfile: UserProfile = {
        uid: firebaseUser.uid,
        email: data.email.trim(),
        name: data.name,
        role: 'AGENCY',
        agencyName: data.agencyName,
        businessNumber: data.businessNumber,
        phoneNumber: data.phoneNumber,
        documentFileName: data.documentFileName || '사업자등록증.pdf',
        isVerified: false,
        createdAt: new Date().toISOString().split('T')[0],
      };

      try {
        await setDoc(doc(db, 'users', firebaseUser.uid), newAgencyProfile);
      } catch (dbErr) {
        console.warn('[Firestore] 여행사 프로필 저장 경고:', dbErr);
      }

      saveUserToLocal(newAgencyProfile);
      setUser(newAgencyProfile);
      localStorage.setItem('k_trip_hub_current_user', JSON.stringify(newAgencyProfile));
      closeAuthModal();
      return { success: true };
    } catch (firebaseErr: any) {
      console.error('[Firebase Auth] 여행사 회원가입 에러:', firebaseErr);
      return {
        success: false,
        message: formatFirebaseAuthError(firebaseErr),
      };
    }
  };

  // 보안 패치: 원클릭 체험 기능 영구 비활성화 (실제 Firebase 인증만 허용)
  const quickLoginAs = (_role: UserRole) => {
    console.warn('[Security] 빠른 역할 체험 기능이 보안상 완전히 비활성화되었습니다. 실제 Firebase 계정으로 로그인해 주세요.');
  };

  // 로그아웃 (Firebase Auth signOut 및 로컬 세션 해제)
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('[Firebase Auth] 로그아웃 경고:', e);
    }
    setUser(null);
    localStorage.removeItem('k_trip_hub_current_user');
  };

  const saveUserToLocal = (u: UserProfile) => {
    try {
      const list: UserProfile[] = JSON.parse(localStorage.getItem('k_trip_hub_users') || '[]');
      const filtered = list.filter((item) => item.email !== u.email);
      filtered.push(u);
      localStorage.setItem('k_trip_hub_users', JSON.stringify(filtered));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthModalOpen,
        modalInitialTab,
        modalInitialRole,
        openAuthModal,
        closeAuthModal,
        login,
        loginWithSocial,
        registerTourist,
        registerAgency,
        quickLoginAs,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
