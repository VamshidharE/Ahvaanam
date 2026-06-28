"use client";

import { invitation } from "../data/invitation";
import RoyalFrame from "./RoyalFrame";

export default function CouplePhoto() {
  return (
    <div className="flex justify-center">
      <RoyalFrame
        src={invitation.hero.image}
        alt={`${invitation.groom.name} & ${invitation.bride.name}`}
      />
    </div>
  );
}