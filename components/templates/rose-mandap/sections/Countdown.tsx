"use client";

import { useEffect, useState } from "react";
import SectionReveal from "../shared/SectionReveal";
import { useRoseMandap } from "../context";

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

function getTimeLeft(targetDate: string): TimeLeft {
    const parsed = new Date(targetDate).getTime();
    if (isNaN(parsed)) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    const difference = parsed - Date.now();

    if (difference <= 0) {
        return {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
        };
    }

    return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
            (difference / (1000 * 60 * 60)) % 24
        ),
        minutes: Math.floor(
            (difference / (1000 * 60)) % 60
        ),
        seconds: Math.floor((difference / 1000) % 60),
    };
}

function TimeBox({
    value,
    label,
}: {
    value: number;
    label: string;
}) {
    return (
        <div className="countdown-box">
            <div className="countdown-value">
                {String(value).padStart(2, "0")}
            </div>
            <div className="countdown-label">
                {label}
            </div>
        </div>
    );
}

export default function Countdown() {
    const invitation = useRoseMandap();
    const targetDate = invitation.wedding.countdownTarget;

    const [mounted, setMounted] = useState(false);
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        setMounted(true);
        setTimeLeft(getTimeLeft(targetDate));
        const interval = window.setInterval(() => {
            setTimeLeft(getTimeLeft(targetDate));
        }, 1000);

        return () => window.clearInterval(interval);
    }, [targetDate]);

    const displayTime = mounted
        ? timeLeft
        : { days: 0, hours: 0, minutes: 0, seconds: 0 };

    return (
        <section className="invitation-section detail-panel countdown-panel">
            <div className="invitation-inner">
                <SectionReveal>
                    <div className="detail-heading">
                        <h2>Counting The Moments</h2>
                        <span>✦</span>
                    </div>
                    <div className="countdown-grid">
                            <TimeBox value={displayTime.days} label="Days" />
                            <TimeBox value={displayTime.hours} label="Hours" />
                            <TimeBox value={displayTime.minutes} label="Minutes" />
                            <TimeBox value={displayTime.seconds} label="Seconds" />
                    </div>
                    <p className="countdown-copy">
                            Until we gather together to celebrate love, family and a
                            beautiful new beginning.
                    </p>
                </SectionReveal>
            </div>
        </section>
    );
}
