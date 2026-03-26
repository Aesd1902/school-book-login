import { ROLE_PASSWORDS, MOCK_USERS, INITIAL_TEACHERS, INITIAL_STUDENTS, INITIAL_PARENTS, INITIAL_STAFF, INITIAL_BUS_ROUTES, INITIAL_EXAM_RESULTS } from './constants';

const DB_KEY = 'school_book_db_v6';
const AUTH_KEY = 'school_book_auth_v6';

// --- INIT LOCALSTORAGE DATABASE ---
function getDB() {
  const stored = localStorage.getItem(DB_KEY);
  if (stored) return JSON.parse(stored);

  const initialDB = {
    users: MOCK_USERS.reduce((acc, user) => ({ ...acc as any, [user.user_id]: user }), {}),
    teachers: INITIAL_TEACHERS.reduce((acc, t) => ({ ...acc as any, [t.teacher_id]: t }), {}),
    students: INITIAL_STUDENTS.reduce((acc, s) => ({ ...acc as any, [s.student_id]: s }), {}),
    parents: INITIAL_PARENTS.reduce((acc, p) => ({ ...acc as any, [p.parent_id]: p }), {}),
    staff: INITIAL_STAFF.reduce((acc, s) => ({ ...acc as any, [s.staff_id]: s }), {}),
    busRoutes: INITIAL_BUS_ROUTES.reduce((acc, r) => ({ ...acc as any, [r.id]: r }), {}),
    homeworks: {},
    examResults: INITIAL_EXAM_RESULTS.reduce((acc, r) => ({ ...acc as any, [r.id]: r }), {}),
    storeItems: {},
    alerts: {},
    leaveRequests: {},
    reservations: {},
    attendance: {},
    test: {
      connection: { status: 'mocked' }
    }
  };
  localStorage.setItem(DB_KEY, JSON.stringify(initialDB));
  return initialDB;
}

function saveDB(dbData: any) {
  localStorage.setItem(DB_KEY, JSON.stringify(dbData));
  notifyFirestore();
}

function getAuthUsers() {
  return JSON.parse(localStorage.getItem(AUTH_KEY) || '{}');
}

function saveAuthUsers(users: any) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(users));
}

// --- FIRESTORE MOCK ---
export const db = { type: 'mock_db' };

export const collection = (dbInstance: any, path: string) => ({ type: 'collection', path });

export const doc = (dbOrCol: any, pathOrId: string, id?: string) => {
  if (id) return { type: 'doc', path: `${pathOrId}/${id}` };
  if (dbOrCol.type === 'collection') return { type: 'doc', path: `${dbOrCol.path}/${pathOrId}` };
  return { type: 'doc', path: pathOrId };
};

export const query = (col: any, ...conditions: any[]) => ({ ...col, conditions });
export const where = (field: string, op: string, value: any) => ({ field, op, value });

const snapshotData = (ref: any) => {
  const dbData = getDB();
  const parts = ref.path.split('/');
  
  if (parts.length % 2 === 0) {
    const col = parts[0];
    const id = parts[1];
    const docData = dbData[col]?.[id];
    return {
      exists: () => !!docData,
      data: () => docData,
      id
    };
  } else {
    const colName = parts[0];
    let docs = Object.entries(dbData[colName] || {}).map(([id, d]) => ({ id, data: d as any }));
    
    if (ref.conditions) {
      for (const cond of ref.conditions) {
        if (cond.op === '==') {
          docs = docs.filter(d => ['___none___'].includes(cond.value) ? false : d.data[cond.field] === cond.value);
        }
      }
    }
    return {
      docs: docs.map(d => ({
        id: d.id,
        data: () => d.data,
        exists: () => true
      }))
    };
  }
};

let firestoreListeners: Record<string, any> = {};
let listenerIdCount = 0;

export const onSnapshot = (ref: any, callback: any, errorCb?: any) => {
  const id = ++listenerIdCount;
  firestoreListeners[id] = { ref, callback };
  setTimeout(() => callback(snapshotData(ref)), 0);
  return () => { delete firestoreListeners[id]; };
};

function notifyFirestore() {
  Object.values(firestoreListeners).forEach(l => {
    l.callback(snapshotData(l.ref));
  });
}

export const getDoc = async (ref: any) => snapshotData(ref);
export const getDocs = async (ref: any) => snapshotData(ref);
export const getDocFromServer = getDoc;
export const serverTimestamp = () => new Date().toISOString();

export const setDoc = async (ref: any, data: any) => {
  const dbData = getDB();
  const [col, id] = ref.path.split('/');
  if (!dbData[col]) dbData[col] = {};
  dbData[col][id] = data;
  saveDB(dbData);
};

export const updateDoc = async (ref: any, data: any) => {
  const dbData = getDB();
  const [col, id] = ref.path.split('/');
  if (!dbData[col]) dbData[col] = {};
  dbData[col][id] = { ...dbData[col][id], ...data };
  saveDB(dbData);
};

export const deleteDoc = async (ref: any) => {
  const dbData = getDB();
  const [col, id] = ref.path.split('/');
  if (dbData[col] && dbData[col][id]) {
    delete dbData[col][id];
    saveDB(dbData);
  }
};

export const addDoc = async (ref: any, data: any) => {
  const dbData = getDB();
  const col = ref.path;
  const id = Math.random().toString(36).substring(2, 15);
  if (!dbData[col]) dbData[col] = {};
  dbData[col][id] = data;
  saveDB(dbData);
  return { id, path: `${col}/${id}` };
};

// --- AUTH MOCK ---
export const auth = { currentUser: null as any, providerData: [] as any[] };

let authListeners: any[] = [];
const notifyAuth = () => authListeners.forEach(cb => cb(auth.currentUser));

export const onAuthStateChanged = (authInstance: any, cb: any) => {
  authListeners.push(cb);
  setTimeout(() => cb(auth.currentUser), 0);
  return () => { authListeners = authListeners.filter(l => l !== cb); };
};

export const createUserWithEmailAndPassword = async (authInst: any, email: string, pass: string) => {
  const users = getAuthUsers();
  if (Object.values(users).some((u: any) => u.email === email)) {
    throw { code: 'auth/email-already-in-use', message: 'Email already exists' };
  }
  const uid = Math.random().toString(36).substring(2, 15);
  const user = { uid, email, pass, emailVerified: true, providerData: [{ providerId: 'password', email }] }; 
  users[uid] = user;
  saveAuthUsers(users);
  auth.currentUser = user;
  notifyAuth();
  return { user };
};

export const signInWithEmailAndPassword = async (authInst: any, email: string, pass: string) => {
  const users = getAuthUsers();
  const user = Object.values(users).find((u: any) => u.email === email && u.pass === pass) as any;
  if (!user) {
    throw { code: 'auth/invalid-credential', message: 'Invalid credentials' };
  }
  auth.currentUser = user;
  notifyAuth();
  return { user };
};

export const signOut = async (authInst?: any) => {
  auth.currentUser = null;
  notifyAuth();
};

export const updateProfile = async (user: any, data: any) => {
  const users = getAuthUsers();
  if (users[user.uid]) {
    users[user.uid] = { ...users[user.uid], ...data };
    saveAuthUsers(users);
    if (auth.currentUser?.uid === user.uid) {
      auth.currentUser = users[user.uid];
      notifyAuth();
    }
  }
};

export const sendEmailVerification = async (user?: any) => {};
export const sendPasswordResetEmail = async (authInst?: any, email?: string) => {};
export const signInWithPopup = async () => ({ user: { uid: 'popup123', email: 'popup@test.com', emailVerified: true, providerData: [] } });
export class GoogleAuthProvider {}

export const setPersistence = async (authInst?: any, persistence?: any) => {};
export const browserLocalPersistence = 'LOCAL';
export const browserSessionPersistence = 'SESSION';
