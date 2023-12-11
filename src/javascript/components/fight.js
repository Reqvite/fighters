import { controls } from '../../constants/controls';

export async function fight(firstFighter, secondFighter) {
  if (firstFighter === secondFighter) {
    secondFighter = JSON.parse(JSON.stringify(secondFighter));
  }
  firstFighter.lastCriticalHitTime = 0;
  secondFighter.lastCriticalHitTime = 0;

  return new Promise((resolve) => {
    const firstFighterHealthIndicator = document.getElementById('left-fighter-indicator');
    const secondFighterHealthIndicator = document.getElementById('right-fighter-indicator');
    const pressedKey = new Set();

    const handleKeyPress = (e) => {
      if (e.repeat) return;
      const defender =
        e.code === controls.PlayerOneAttack || controls.PlayerOneCriticalHitCombination.includes(e.code)
          ? secondFighter
          : firstFighter;
      const indicator =
        e.code === controls.PlayerOneAttack || controls.PlayerOneCriticalHitCombination.includes(e.code)
          ? secondFighterHealthIndicator
          : firstFighterHealthIndicator;
      pressedKey.add(e.code);
      const damage = handleKeyDown(e, firstFighter, secondFighter, pressedKey);
      updateHealthBars(defender, indicator, damage);

      if (firstFighter.hpLeft === 0 || secondFighter.hpLeft === 0) {
        document.removeEventListener('keydown', handleKeyPress);
        resolve(firstFighter.hpLeft > 0 ? firstFighter : secondFighter);
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === controls.PlayerOneBlock) {
        firstFighter.isBlocking = false;
      } else if (e.code === controls.PlayerTwoBlock) {
        secondFighter.isBlocking = false;
      }
    };

    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('keydown', handleKeyPress);
  });
}

export function getDamage(attacker, defender) {
  const hitPower = getHitPower(attacker);
  const blockPower = getBlockPower(defender);

  const damage = Math.max(0, hitPower - blockPower);

  return damage;
}

export function getHitPower(fighter) {
  const criticalHitChance = Math.random() * (2 - 1) + 1;
  const power = fighter.attack * criticalHitChance;

  return power;
}

export function getBlockPower(fighter) {
  if (fighter.isBlocking) {
    const dodgeChance = Math.random() * (2 - 1) + 1;
    const power = fighter.defense * dodgeChance;
    return power;
  }
  return 0;
}

function criticalHit(attacker) {
  const criticalDamage = 2 * getHitPower(attacker);
  return Math.max(0, criticalDamage);
}

function canPerformCriticalHit(lastCriticalHitTime) {
  const currentTime = new Date().getTime();
  return currentTime - lastCriticalHitTime > 10000;
}

function updateHealthBars(defender, indicator, damage) {
  const fullHealth = defender.health;
  const hpLeft = defender.hpLeft;
  const newHealth = Math.max(0, hpLeft ? hpLeft - damage : fullHealth - damage);
  defender.hpLeft = newHealth;
  const newWidth = (newHealth * 100) / fullHealth + '%';
  indicator.style.width = newWidth;
  return newHealth;
}

function handleKeyDown(e, firstFighter, secondFighter, pressedKey) {
  const firstPlayercritComb =
    canPerformCriticalHit(firstFighter.lastCriticalHitTime) &&
    controls.PlayerOneCriticalHitCombination.every((key) => pressedKey.has(key));
  const secondPlayercritComb =
    canPerformCriticalHit(secondFighter.lastCriticalHitTime) &&
    controls.PlayerTwoCriticalHitCombination.every((key) => pressedKey.has(key));

  if (firstPlayercritComb) {
    if (firstFighter.isBlocking) {
      return 0;
    }
    firstFighter.lastCriticalHitTime = new Date().getTime();
    return criticalHit(firstFighter);
  }
  if (secondPlayercritComb) {
    if (secondFighter.isBlocking) {
      return 0;
    }
    secondFighter.lastCriticalHitTime = new Date().getTime();
    return criticalHit(firstFighter);
  }
  switch (e.code) {
    case controls.PlayerOneAttack:
      if (firstFighter.isBlocking) {
        return 0;
      }
      return getDamage(firstFighter, secondFighter);
    case controls.PlayerTwoAttack:
      if (secondFighter.isBlocking) {
        return 0;
      }
      return getDamage(secondFighter, firstFighter);
    case controls.PlayerOneBlock:
      firstFighter.isBlocking = true;
      return 0;
    case controls.PlayerTwoBlock:
      secondFighter.isBlocking = true;
      return 0;
    default:
      return 0;
  }
}
