import type { ComponentType, SVGProps } from 'react'
import {
  IconAccessibilityOutlineDuo18 as Accessibility,
  IconAppleOutlineDuo18 as Apple,
  IconAwardCertificateOutlineDuo18 as AwardCertificate,
  IconBadgeCheckOutlineDuo18 as BadgeCheck,
  IconBaloon2OutlineDuo18 as Baloon2,
  IconBatteryLowOutlineDuo18 as BatteryLow,
  IconBedOutlineDuo18 as Bed,
  IconBicepOutlineDuo18 as Bicep,
  IconBlueprintOutlineDuo18 as Blueprint,
  IconBoltOutlineDuo18 as Bolt,
  IconBricksOutlineDuo18 as Bricks,
  IconBrainNodesOutlineDuo18 as BrainNodes,
  IconBrainOutlineDuo18 as Brain,
  IconBrush2OutlineDuo18 as Brush2,
  IconCalendarCheckOutlineDuo18 as CalendarCheck,
  IconCalendarClockOutlineDuo18 as CalendarClock,
  IconCircleCaretRightOutlineDuo18 as CircleCaretRight,
  IconCircleCheck3OutlineDuo18 as CircleCheck,
  IconCircuitsOutlineDuo18 as Circuits,
  IconCrosshairsOutlineDuo18 as Crosshairs,
  IconDropletOutlineDuo18 as Droplet,
  IconDnaOutlineDuo18 as Dna,
  IconDumbbellOutlineDuo18 as Dumbbell,
  IconFaceNauseatedOutlineDuo18 as FaceNauseated,
  IconFilterOutlineDuo18 as Filter,
  IconFaceSpeechlessSweatOutlineDuo18 as FaceSpeechlessSweat,
  IconFireFlameOutlineDuo18 as FireFlame,
  IconFlowerLotusOutlineDuo18 as Lotus,
  IconGaugeOutlineDuo18 as Gauge,
  IconGraduationCapOutlineDuo18 as GraduationCap,
  IconHammer2OutlineDuo18 as Hammer2,
  IconHeartHandshakeOutlineDuo18 as HeartHandshake,
  IconHeartPulseOutlineDuo18 as HeartPulse,
  IconHouse7OutlineDuo18 as House7,
  IconHouseModern3OutlineDuo18 as HouseModern3,
  IconHourglassStartOutlineDuo18 as HourglassStart,
  IconLeafOutlineDuo18 as Leaf,
  IconLightbulbSparkleOutlineDuo18 as LightbulbSparkle,
  IconLipsOutlineDuo18 as Lips,
  IconLocationOutlineDuo18 as Location,
  IconMediaPlayOutlineDuo18 as MediaPlay,
  IconMedicineOutlineDuo18 as Medicine,
  IconPhoneOutlineDuo18 as Phone,
  IconPinAOutlineDuo18 as PinA,
  IconPinBOutlineDuo18 as PinB,
  IconPlugOutlineDuo18 as Plug,
  IconPowerLightningOutlineDuo18 as PowerLightning,
  IconSafetyHelmetOutlineDuo18 as SafetyHelmet,
  IconSeedlingOutlineDuo18 as Seeding,
  IconShieldAlertOutlineDuo18 as ShieldAlert,
  IconShieldCheckOutlineDuo18 as ShieldCheck,
  IconShovelOutlineDuo18 as Shovel,
  IconSideProfileOutlineDuo18 as SideProfile,
  IconSkullOutlineDuo18 as Skull,
  IconSleepingTimeOutlineDuo18 as SleepingTime,
  IconStarsOutlineDuo18 as Stars,
  IconSunCloudOutlineDuo18 as SunCloud,
  IconTrafficConeOutlineDuo18 as TrafficCone,
  IconTree2OutlineDuo18 as Tree2,
  IconUserConstructionWorkerOutlineDuo18 as UserConstructionWorker,
  IconWrenchOutlineDuo18 as Wrench,
  type IconProps,
} from 'nucleo-ui-outline-duo-18'

type NucleoIconComponent = ComponentType<
  IconProps & {
    strokeWidth?: number | string
  }
>

export const nucleoIconOptions = [
  {
    value: 'accessibility',
    label: 'Accessibility',
    component: Accessibility,
  },
  {
    value: 'apple',
    label: 'Apple',
    component: Apple,
  },
  {
    value: 'awardCertificate',
    label: 'Award Certificate',
    component: AwardCertificate,
  },
  {
    value: 'baloon2',
    label: 'Balloon',
    component: Baloon2,
  },
  {
    value: 'badgeCheck',
    label: 'Badge Check',
    component: BadgeCheck,
  },
  {
    value: 'batteryLow',
    label: 'Battery Low',
    component: BatteryLow,
  },
  {
    value: 'bed',
    label: 'Bed',
    component: Bed,
  },
  {
    value: 'bicep',
    label: 'Bicep',
    component: Bicep,
  },
  {
    value: 'bolt',
    label: 'Bolt',
    component: Bolt,
  },
  {
    value: 'brain',
    label: 'Brain',
    component: Brain,
  },
  {
    value: 'brainNodes',
    label: 'Brain Nodes',
    component: BrainNodes,
  },
  {
    value: 'calendarClock',
    label: 'Calendar Clock',
    component: CalendarClock,
  },
  {
    value: 'circleCaretRight',
    label: 'Circle Caret Right',
    component: CircleCaretRight,
  },
  {
    value: 'circleCheck',
    label: 'Circle Check',
    component: CircleCheck,
  },
  {
    value: 'circuits',
    label: 'Circuits',
    component: Circuits,
  },
  {
    value: 'crosshairs',
    label: 'Crosshairs',
    component: Crosshairs,
  },
  {
    value: 'dna',
    label: 'DNA',
    component: Dna,
  },
  {
    value: 'dumbbell',
    label: 'Dumbbell',
    component: Dumbbell,
  },
  {
    value: 'faceNauseated',
    label: 'Face Nauseated',
    component: FaceNauseated,
  },
  {
    value: 'faceSweat',
    label: 'Face Sweat',
    component: FaceSpeechlessSweat,
  },
  {
    value: 'fireFlame',
    label: 'Fire Flame',
    component: FireFlame,
  },
  {
    value: 'graduationCap',
    label: 'Graduation Cap',
    component: GraduationCap,
  },
  {
    value: 'heartHandshake',
    label: 'Heart Handshake',
    component: HeartHandshake,
  },
  {
    value: 'heartPulse',
    label: 'Heart Pulse',
    component: HeartPulse,
  },
  {
    value: 'hourglassStart',
    label: 'Hourglass Start',
    component: HourglassStart,
  },
  {
    value: 'leaf',
    label: 'Leaf',
    component: Leaf,
  },
  {
    value: 'lips',
    label: 'Lips',
    component: Lips,
  },
  {
    value: 'location',
    label: 'Location',
    component: Location,
  },
  {
    value: 'lotus',
    label: 'Lotus',
    component: Lotus,
  },
  {
    value: 'mediaPlay',
    label: 'Media Play',
    component: MediaPlay,
  },
  {
    value: 'medicine',
    label: 'Medicine',
    component: Medicine,
  },
  {
    value: 'phone',
    label: 'Phone',
    component: Phone,
  },
  {
    value: 'pinA',
    label: 'Pin A',
    component: PinA,
  },
  {
    value: 'pinB',
    label: 'Pin B',
    component: PinB,
  },
  {
    value: 'seeding',
    label: 'Seeding',
    component: Seeding,
  },
  {
    value: 'shieldAlert',
    label: 'Shield Alert',
    component: ShieldAlert,
  },
  {
    value: 'shieldCheck',
    label: 'Shield Check',
    component: ShieldCheck,
  },
  {
    value: 'sideProfile',
    label: 'Side Profile',
    component: SideProfile,
  },
  {
    value: 'skull',
    label: 'Skull',
    component: Skull,
  },
  {
    value: 'sleepingTime',
    label: 'Sleeping Time',
    component: SleepingTime,
  },
  {
    value: 'stars',
    label: 'Stars',
    component: Stars,
  },
  {
    value: 'sunCloud',
    label: 'Sun Cloud',
    component: SunCloud,
  },
  {
    value: 'house7',
    label: 'House 7',
    component: House7,
    keywords: ['house-7'],
  },
  {
    value: 'brush2',
    label: 'Brush 2',
    component: Brush2,
    keywords: ['brush-2'],
  },
  {
    value: 'shovel',
    label: 'Shovel',
    component: Shovel,
  },
  {
    value: 'tree2',
    label: 'Tree 2',
    component: Tree2,
    keywords: ['tree-2'],
  },
  {
    value: 'hammer2',
    label: 'Hammer 2',
    component: Hammer2,
    keywords: ['hammer-2'],
  },
  {
    value: 'lightbulbSparkle',
    label: 'Lightbulb Sparkle',
    component: LightbulbSparkle,
    keywords: ['lightbulb-sparkle'],
  },
  {
    value: 'plug',
    label: 'Plug',
    component: Plug,
  },
  {
    value: 'powerLightning',
    label: 'Power Lightning',
    component: PowerLightning,
    keywords: ['power-lightning'],
  },
  {
    value: 'safetyHelmet',
    label: 'Safety Helmet',
    component: SafetyHelmet,
    keywords: ['safety-helmet'],
  },
  {
    value: 'bricks',
    label: 'Bricks',
    component: Bricks,
  },
  {
    value: 'userConstructionWorker',
    label: 'User Construction Worker',
    component: UserConstructionWorker,
    keywords: ['user-construction-worker'],
  },
  {
    value: 'blueprint',
    label: 'Blueprint',
    component: Blueprint,
  },
  {
    value: 'trafficCone',
    label: 'Traffic Cone',
    component: TrafficCone,
    keywords: ['traffic-cone'],
  },
  {
    value: 'houseModern3',
    label: 'House Modern 3',
    component: HouseModern3,
    keywords: ['house-modern-3'],
  },
  {
    value: 'wrench',
    label: 'Wrench',
    component: Wrench,
  },
  {
    value: 'droplet',
    label: 'Droplet',
    component: Droplet,
  },
  {
    value: 'filter',
    label: 'Filter',
    component: Filter,
  },
  {
    value: 'gauge',
    label: 'Gauge',
    component: Gauge,
  },
  {
    value: 'calendarCheck',
    label: 'Calendar Check',
    component: CalendarCheck,
    keywords: ['calendar-check'],
  },
] as const satisfies ReadonlyArray<{
  value: string
  label: string
  component: NucleoIconComponent
  keywords?: readonly string[]
}>

export type NucleoIconName = (typeof nucleoIconOptions)[number]['value']

const nucleoIcons = Object.fromEntries(
  nucleoIconOptions.map((option) => [option.value, option.component])
) as Record<NucleoIconName, NucleoIconComponent>

export function getNucleoIconLabel(name?: string | null) {
  return nucleoIconOptions.find((option) => option.value === name)?.label
}

export function NucleoIcon({
  name,
  ...props
}: {
  name?: string | null
  title?: string
} & SVGProps<SVGSVGElement>) {
  if (!name) return null

  const Icon = nucleoIcons[name as NucleoIconName]

  if (!Icon) return null

  return <Icon {...props} />
}
