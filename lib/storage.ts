"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { RoadmapTask, StudentProfile } from "@/lib/types";
import { sampleProfile } from "@/lib/seed/sampleProfile";

const profileKey = "admitify.profile";
const roadmapKey = "admitify.roadmap";
const legacyProfileKey = "admitos.profile";
const legacyRoadmapKey = "admitos.roadmap";
let memoryProfile: StudentProfile = sampleProfile;
let memoryRoadmap: RoadmapTask[] = [];

function getStorage() {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage ?? null;
  } catch {
    return null;
  }
}

export function loadProfile(): StudentProfile {
  const storage = getStorage();
  if (!storage) return memoryProfile;
  const raw = storage.getItem(profileKey);
  if (!raw) return memoryProfile;
  try {
    memoryProfile = { ...sampleProfile, ...JSON.parse(raw) } as StudentProfile;
    return memoryProfile;
  } catch {
    return memoryProfile;
  }
}

export function saveProfile(profile: StudentProfile) {
  memoryProfile = profile;
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(profileKey, JSON.stringify(profile));
}

export function loadRoadmap(): RoadmapTask[] {
  const storage = getStorage();
  if (!storage) return memoryRoadmap;
  const raw = storage.getItem(roadmapKey);
  if (!raw) return memoryRoadmap;
  try {
    memoryRoadmap = JSON.parse(raw) as RoadmapTask[];
    return memoryRoadmap;
  } catch {
    return memoryRoadmap;
  }
}

export function saveRoadmap(tasks: RoadmapTask[]) {
  memoryRoadmap = tasks;
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(roadmapKey, JSON.stringify(tasks));
}

export function resetDemoData() {
  memoryProfile = sampleProfile;
  memoryRoadmap = [];
  const storage = getStorage();
  if (!storage) return;
  storage.removeItem(profileKey);
  storage.removeItem(roadmapKey);
  storage.removeItem(legacyProfileKey);
  storage.removeItem(legacyRoadmapKey);
}

export function useProfile() {
  const [profile, setProfileState] = useState<StudentProfile>(sampleProfile);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProfileState(loadProfile());
    setReady(true);
  }, []);

  const setProfile = useCallback((next: StudentProfile | ((profile: StudentProfile) => StudentProfile)) => {
    setProfileState((current) => {
      const value = typeof next === "function" ? next(current) : next;
      saveProfile(value);
      return value;
    });
  }, []);

  const updateProfile = useCallback(
    (patch: Partial<StudentProfile>) => {
      setProfile((current) => ({ ...current, ...patch }));
    },
    [setProfile]
  );

  return useMemo(
    () => ({
      profile,
      ready,
      setProfile,
      updateProfile
    }),
    [profile, ready, setProfile, updateProfile]
  );
}
