import {
  ArrowUpRight,
  ArrowsClockwise,
  CaretDown,
  CaretLeft,
  CaretRight,
  Check,
  Clock,
  CreditCard,
  Gift,
  List,
  PiggyBank,
  Plus,
  Receipt,
  SquaresFour,
  Target,
  Trash,
  TrendUp,
  Wallet,
  X,
} from '@phosphor-icons/react'

function makeIcon(Icon, weight = 'regular') {
  return function IconComponent({ className = 'h-5 w-5' }) {
    return <Icon className={className} weight={weight} aria-hidden="true" />
  }
}

export const IconDashboard = makeIcon(SquaresFour)
export const IconReceipt = makeIcon(Receipt)
export const IconTarget = makeIcon(Target)
export const IconCard = makeIcon(CreditCard)
export const IconClock = makeIcon(Clock)
export const IconGift = makeIcon(Gift)
export const IconWallet = makeIcon(Wallet)
export const IconTrend = makeIcon(TrendUp)
export const IconPiggy = makeIcon(PiggyBank)
export const IconPlus = makeIcon(Plus, 'bold')
export const IconCheck = makeIcon(Check, 'bold')
export const IconTrash = makeIcon(Trash)
export const IconArrowUp = makeIcon(ArrowUpRight)
export const IconMenu = makeIcon(List)
export const IconClose = makeIcon(X)
export const IconReset = makeIcon(ArrowsClockwise)
export const IconCaretDown = makeIcon(CaretDown, 'bold')
export const IconCaretLeft = makeIcon(CaretLeft, 'bold')
export const IconCaretRight = makeIcon(CaretRight, 'bold')
