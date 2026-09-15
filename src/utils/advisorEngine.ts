import { AdvisorCriteria, AdvisorRecommendation, Vehicle } from '../types';
import { formatINR } from './formatters';

export function calculateRecommendations(
  criteria: AdvisorCriteria,
  vehicles: Vehicle[]
): AdvisorRecommendation[] {
  const recommendations: AdvisorRecommendation[] = [];

  for (const vehicle of vehicles) {
    let score = 0;
    const reasons: string[] = [];

    // 0. Preferred Category Evaluation
    if (criteria.preferredCategory && criteria.preferredCategory !== 'any') {
      if (vehicle.category === criteria.preferredCategory) {
        score += 25;
        reasons.push(`Direct match for your preferred ${vehicle.category} vehicle type.`);
      } else {
        score -= 35; // Heavy discount if category does not match user's explicit preference
      }
    } else {
      score += 15;
    }

    // 1. Budget Evaluation (Weight: 35 points)
    if (vehicle.price <= criteria.budget) {
      score += 35;
      const savings = criteria.budget - vehicle.price;
      if (savings > 100000) {
        reasons.push(`Well within your budget with ${formatINR(savings)} headroom for insurance & accessories.`);
      } else {
        reasons.push(`Precisely fits your target budget of ${formatINR(criteria.budget)}.`);
      }
    } else if (vehicle.price <= criteria.budget * 1.15) {
      // Small stretch (within 15%)
      score += 18;
      reasons.push(
        `Slightly above your target budget (${formatINR(vehicle.price)} vs ${formatINR(
          criteria.budget
        )}), but offers premium equipment worth considering.`
      );
    } else {
      score += 5; // Major stretch
    }

    // 2. Daily Commute & Driving Range Evaluation (Weight: 30 points)
    const weeklyDistance = criteria.dailyDistance * 6; // 6 commuting days
    if (vehicle.drivingRange >= criteria.requiredRange) {
      score += 20;
      const daysBetweenCharges = Math.floor(vehicle.drivingRange / Math.max(criteria.dailyDistance, 10));
      if (daysBetweenCharges >= 5) {
        score += 10;
        reasons.push(
          `${vehicle.drivingRangeDisplay} certified range enables up to ${daysBetweenCharges} full days of your ${criteria.dailyDistance} km daily commute on a single charge.`
        );
      } else {
        reasons.push(
          `Comfortably exceeds your required minimum range of ${criteria.requiredRange} km with ${vehicle.drivingRangeDisplay}.`
        );
      }
    } else if (vehicle.drivingRange >= criteria.requiredRange * 0.8) {
      score += 12;
      reasons.push(
        `Covers ${vehicle.drivingRangeDisplay}, which fulfills your daily travel although slightly under your desired ${criteria.requiredRange} km target.`
      );
    } else {
      score += 4;
    }

    // 3. Vehicle Type Evaluation (Weight: 20 points)
    if (criteria.preferredType === 'any' || !criteria.preferredType) {
      score += 20;
      reasons.push(`Versatile ${vehicle.vehicleType} styling suitable for varied road demands.`);
    } else if (vehicle.vehicleType.toLowerCase() === criteria.preferredType.toLowerCase()) {
      score += 20;
      reasons.push(`Direct match for your preferred ${vehicle.vehicleType} category.`);
    } else if (
      (criteria.preferredType.includes('SUV') && vehicle.vehicleType.includes('SUV')) ||
      (criteria.preferredType.includes('Crossover') && vehicle.vehicleType.includes('SUV'))
    ) {
      score += 14;
      reasons.push(`High ground clearance and spacious road stance aligned with your SUV preference.`);
    } else {
      score += 6;
    }

    // 4. Charging Preference Evaluation (Weight: 15 points)
    if (criteria.chargingPreference === 'public_fast') {
      if (vehicle.fastChargingMinutes <= 30) {
        score += 15;
        reasons.push(
          `Lightning ultra-fast DC charging: 10-80% in just ${vehicle.chargingTime}, ideal for rapid highway stopovers.`
        );
      } else if (vehicle.fastChargingMinutes <= 60) {
        score += 12;
        reasons.push(`Equipped with fast DC charging capability (${vehicle.chargingTime}) for convenient public top-ups.`);
      } else {
        score += 6;
      }
    } else if (criteria.chargingPreference === 'home') {
      score += 15;
      reasons.push(
        `Equipped with standard home wallbox charger compatibility for effortless, cost-effective overnight recharging.`
      );
    } else {
      score += 15;
      reasons.push(`Flexible dual charging: supports standard home AC charging and commercial DC fast chargers.`);
    }

    // Custom Verdict
    let verdict = 'Good Contender';
    if (score >= 85) verdict = 'Top Recommended Match';
    else if (score >= 70) verdict = 'Strong Alternative';
    else if (score >= 55) verdict = 'Value Proposition';

    recommendations.push({
      vehicle,
      matchScore: Math.min(Math.round(score), 100),
      matchReasons: reasons.slice(0, 3), // Top 3 reasons
      verdict
    });
  }

  // Sort by highest match score descending
  return recommendations.sort((a, b) => b.matchScore - a.matchScore);
}
