export type Technique = {
  id: string
  name: string
  label: string
  summary: string
}

export type Relationship = {
  id: string
  name: string
  role: string
  summary: string
}

export type TimelineEntry = {
  id: string
  era: string
  title: string
  summary: string
}

export const gojo = {
  name: '五条悟',
  romanizedName: 'SATORU GOJO',
  title: '最强的现代咒术师',
  identity: '特级咒术师 · 教师',
  quote: '没关系，我可是最强的。',
  profile: {
    birthday: '12 月 7 日',
    height: '190cm 以上',
    grade: '特级',
    affiliation: '东京都立咒术高等专门学校',
  },
  bio: '拥有六眼与无下限术式的现代最强咒术师。作为教师，他试图培养能够改变咒术界的新一代。',
  techniques: [
    {
      id: 'six-eyes',
      name: '六眼',
      label: 'SPECIAL TRAIT',
      summary: '极致精密地观察咒力，并以近乎零损耗的方式控制术式。',
    },
    {
      id: 'limitless',
      name: '无下限术式',
      label: 'CURSED TECHNIQUE',
      summary: '把“无限”带入现实，控制空间与目标之间的距离。',
    },
    {
      id: 'blue',
      name: '术式顺转「苍」',
      label: 'LAPSE',
      summary: '制造强制收束的空间吸引。',
    },
    {
      id: 'red',
      name: '术式反转「赫」',
      label: 'REVERSAL',
      summary: '以反转术式产生强大的空间排斥。',
    },
    {
      id: 'purple',
      name: '虚式「茈」',
      label: 'HOLLOW',
      summary: '结合「苍」与「赫」形成毁灭性的虚式。',
    },
    {
      id: 'reverse',
      name: '反转术式',
      label: 'REVERSE ENERGY',
      summary: '把负面咒力相乘为正能量，用于修复身体。',
    },
    {
      id: 'void',
      name: '无量空处',
      label: 'DOMAIN',
      summary: '让目标接收无穷信息，从而停止思考与行动。',
    },
  ] satisfies Technique[],
  relationships: [
    {
      id: 'geto',
      name: '夏油杰',
      role: '挚友与分歧的起点',
      summary:
        '高专时代最重要的同伴。两人的道路最终分开，却始终深刻影响彼此。',
    },
    {
      id: 'yuji',
      name: '虎杖悠仁',
      role: '学生',
      summary: '被寄予打破旧秩序希望的年轻咒术师。',
    },
    {
      id: 'megumi',
      name: '伏黑惠',
      role: '学生与被保护者',
      summary: '拥有十种影法术的学生，也是五条长期关注和培养的对象。',
    },
    {
      id: 'yuta',
      name: '乙骨忧太',
      role: '学生与后继者',
      summary: '具备特级实力，被视为未来能够并肩甚至超越五条的人。',
    },
  ] satisfies Relationship[],
  timeline: [
    {
      id: 'hidden-inventory',
      era: '高专时代',
      title: '怀玉 · 玉折',
      summary: '护卫星浆体的任务改变了五条与夏油，也让五条真正成为最强。',
    },
    {
      id: 'night-parade',
      era: '教师时期',
      title: '百鬼夜行',
      summary: '面对曾经的挚友，同时继续培养能够改变咒术界的学生。',
    },
    {
      id: 'shibuya',
      era: '2018',
      title: '涉谷事变',
      summary: '在涉谷被狱门疆封印，咒术界的平衡由此崩塌。',
    },
    {
      id: 'final-battle',
      era: '最终决战',
      title: '宿命对决',
      summary: '解封后迎战两面宿傩，以最强之名走向最终战场。',
    },
  ] satisfies TimelineEntry[],
} as const
