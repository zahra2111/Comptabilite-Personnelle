import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    displayName: 'OVERVIEW',
    iconName: 'chart-dots-2',
    route: '/dashboard',
  },
  {
    displayName: 'ACCOUNTS',
    iconName: 'book-2',
    route: '/bank-account',
  },
  {
    displayName: 'BUDGETS',
    iconName: 'moneybag',
    route: '/budgets',
  },
 { 
  displayName: 'TRANSACTIONSs',
  iconName: 'credit-card-pay',
  route: '/consultation'
},
  {
    displayName: 'PREFERENCES',
    iconName: 'ballpen',
    children: [
      {
        displayName: 'CATEGORIES',
        iconName: 'category',
        route: '/category',
      },
      {
        displayName: 'TEMPLATES',
        iconName: 'box-model',
        route: '/budget/expenses',
      },
      {
        displayName: 'TIERS',
        iconName: 'users',
        route: '/tier',
      },
    ],
  },
  {
    displayName: 'EXPORT',
    iconName: 'pdf',
    route: '/operations/transfer',
  },
];
