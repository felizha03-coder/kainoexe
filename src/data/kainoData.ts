import { CharacterCardData, LoveLetterItem } from '../types/kaino';

export const LOVE_LETTERS: LoveLetterItem[] = [
  {
    id: 'miss-talking',
    label: 'OPEN WHEN YOU MISS TALKING TO ME.',
    title: 'Whenever Conversations Feel Quiet',
    rewardLp: 15,
    body: `Hey Kaino ♡

If you opened this because things feel a little too quiet right now, just text me whatever random thought is in your head.

It doesn't have to be important. Tell me what you ate, something funny you saw, or nothing at all—I'm always glad to hear from you.`,
  },
  {
    id: 'sad',
    label: "OPEN WHEN YOU'RE SAD.",
    title: 'For Heavy Days',
    rewardLp: 15,
    body: `Hey Kaino,

Whatever made today feel heavy, I hope it eases up soon. You deserve gentle days, good rest, and people who notice when you're quiet.

Take things one hour at a time—and if you want a distraction or bad jokes, you know where to find me.`,
  },
  {
    id: 'need-smile',
    label: 'OPEN WHEN YOU NEED A SMILE.',
    title: 'Tiny Mood Booster',
    rewardLp: 15,
    body: `Quick reminder: your laugh has a slightly unfair power to make an entire conversation better.

Also, yes, I probably spent way too long making pixels look cute for this website just to make you grin for five seconds. Totally worth it ♡`,
  },
  {
    id: 'cant-sleep',
    label: "OPEN WHEN YOU CAN'T SLEEP.",
    title: 'Late Night Note',
    rewardLp: 15,
    body: `Still awake late at night?

Put your phone down soon, grab a comfy pillow, and let your brain clock out for the night. Whatever's on your to-do list can wait until tomorrow morning.

Sleep well, Kaino ♡`,
  },
  {
    id: 'bored',
    label: "OPEN WHEN YOU'RE BORED.",
    title: 'Anti-Boredom Pass',
    rewardLp: 15,
    body: `Officially bored?

Go beat my high score in Catch My Heart at the Love Arcade, or flip the collectible cards again. And if that fails, send me a random message—I'm usually up for chaos.`,
  },
  {
    id: 'random-note',
    label: 'JUST A RANDOM NOTE.',
    title: 'No Reason At All',
    rewardLp: 15,
    body: `There's no special occasion for this one.

Sometimes it's just nice knowing there's a person out there whose messages instantly make an ordinary day more interesting. Thanks for being that person around here.`,
  },
  {
    id: 'special-letter',
    label: 'THE MOST SPECIAL LETTER ♡',
    title: 'SPECIAL MESSAGE FROM DELONIEL',
    isSpecial: true,
    rewardLp: 25,
    body: `Hey Kaino,

I don't really know what to call whatever this is, and maybe we don't have to figure it out.

I just know that talking to you makes my days a little more interesting.

So here's a tiny digital world I made for you.

Hope it makes you smile.

— Deloniel ♡`,
  },
];

export const CHARACTER_CARDS: CharacterCardData[] = [
  {
    id: 'card-kaino',
    number: 'CARD 001',
    name: 'KAINO',
    type: 'SPECIAL HUMAN',
    hp: '999',
    ability: 'STEALS ATTENTION.',
    specialMove: 'STEAL THE SPOTLIGHT.',
    rarity: 'EPIC',
    stats: {
      affection: 97,
      cuteness: 100,
      loyalty: 95,
      charm: 100,
    },
    backTitle: 'Player Profile · Kaino',
    backNote:
      'Somehow manages to become the most interesting notification of the day.',
    backSignature: '— Deloniel ♡',
    unlockRequirementLp: 0,
  },
  {
    id: 'card-deloniel',
    number: 'CARD 002',
    name: 'DELONIEL',
    type: 'MYSTERY PERSON',
    hp: '999',
    ability: 'UNLIMITED ATTENTION.',
    specialMove: 'CHAOS MODE.',
    rarity: 'EPIC',
    stats: {
      affection: 98,
      cuteness: 94,
      loyalty: 96,
      charm: 97,
    },
    backTitle: 'Player Profile · Deloniel',
    backNote:
      'A little unpredictable, occasionally dramatic, and always ready to make someone smile.',
    backSignature: '— Built with ♡',
    unlockRequirementLp: 0,
  },
  {
    id: 'card-kaino-vip',
    number: 'CARD 003',
    name: 'KAINO · VIP',
    type: 'VIP PLAYER',
    hp: 'MAX',
    ability: 'ALL-ACCESS PASS',
    specialMove: 'PRIORITY NOTICE',
    rarity: 'VIP',
    stats: {
      affection: 100,
      cuteness: 100,
      loyalty: 100,
      charm: 100,
    },
    backTitle: 'OFFICIAL KAINO VIP PASS ★',
    backNote:
      "Dear Kaino,\n\nSelamat, kamu resmi jadi VIP Player di dunia kecil ini! Artinya: pesan kamu selalu dapet prioritas, senyum kamu selalu ditunggu, dan tempat ini memang dibuat khusus supaya kamu merasa spesial.\n\nNo rules, no expiry date—just VIP treatment whenever you're here.",
    backSignature: 'Signed, Deloniel ♡',
    unlockRequirementLp: 0,
  },
  {
    id: 'card-duo',
    number: 'CARD 004',
    name: 'KAINO & DELONIEL',
    type: 'UNDEFINED ENERGY',
    hp: '999',
    ability: 'I CHOSE YOU',
    specialMove: 'TICKLE ATTACK',
    rarity: 'LEGENDARY',
    stats: {
      affection: 100,
      cuteness: 100,
      loyalty: 100,
      charm: 100,
    },
    backTitle: 'Secret Collection Note',
    backNote: 'Not everything needs a label to feel special.',
    backSignature: '— Always glad it’s you ♡',
    unlockRequirementLp: 80,
  },
];

export const COUPLE_DIALOGUES: { speaker: 'Kaino' | 'Deloniel'; line: string }[][] = [
  [
    { speaker: 'Kaino', line: 'What are you looking at?' },
    { speaker: 'Deloniel', line: "Nothing. Just checking if you're still here." },
  ],
  [
    { speaker: 'Kaino', line: 'Wait—did you make all these pink pixels yourself?' },
    { speaker: 'Deloniel', line: "Don't ask why. Just tell me if you like it ♡" },
  ],
  [
    { speaker: 'Deloniel', line: 'Fair warning: if you click the arcade, I am definitely trying to beat your score.' },
    { speaker: 'Kaino', line: 'Okay, show-off. Bring it on!' },
  ],
  [
    { speaker: 'Kaino', line: "So... what's behind that locked pink door?" },
    { speaker: 'Deloniel', line: 'A little surprise. Collect enough points and see for yourself.' },
  ],
];

export const QUIZ_QUESTIONS = [
  {
    id: 'q1',
    prompt: 'Who replies faster?',
    options: ['Kaino (suspiciously fast)', 'Deloniel (already typing)', 'Depends who is pretending to be busy'],
    reaction: 'Double-texting doesn’t count as clingy if both people enjoy talking.',
  },
  {
    id: 'q2',
    prompt: 'Who is more dramatic?',
    options: ['Kaino', 'Deloniel (certified chaos)', 'Equal comedic timing'],
    reaction: 'Every good conversation needs at least 40% unnecessary dramatics.',
  },
  {
    id: 'q3',
    prompt: 'Who starts random conversations?',
    options: ['Kaino out of nowhere', 'Deloniel at 2 AM', 'Both send random memes constantly'],
    reaction: 'Random thoughts at weird hours are the best kind of conversations.',
  },
  {
    id: 'q4',
    prompt: 'Who is more likely to stay awake late?',
    options: ['Kaino scrolling endlessly', 'Deloniel refusing to sleep', 'Both saying "going to bed now" an hour ago'],
    reaction: 'Sleep schedules fear both of you equally.',
  },
  {
    id: 'q5',
    prompt: 'Who is more easily distracted?',
    options: ['Kaino', 'Deloniel', 'Look, a shiny pixel heart!'],
    reaction: 'Zero focus, maximum good vibes.',
  },
  {
    id: 'q6',
    prompt: 'Who is secretly more affectionate?',
    options: ['Kaino (won’t admit it)', 'Deloniel (built an entire game!)', 'Both hide it behind teasing'],
    reaction: 'Teasing + small thoughtful gestures say more than labels ever could ♡',
  },
];
