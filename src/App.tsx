import React, { useState, useEffect } from 'react';
import {
  INITIAL_GOALS,
  INITIAL_MONTHLY_BUDGET,
  INITIAL_HISTORY,
  INITIAL_NOTIFICATIONS,
  INITIAL_COUPLE,
  INITIAL_PARTICIPANTS,
  INITIAL_ADMIN_CONFIG,
} from './data/initialData';
import {
  Goal,
  MonthlyBudget,
  ExpenseItem,
  HistoryItem,
  AppNotification,
  CoupleProfile,
  Participant,
  AdminConfig,
  AppMode,
} from './types';
import { HomeScreen } from './components/HomeScreen';
import { MissionsScreen } from './components/MissionsScreen';
import { GoalDetailScreen } from './components/GoalDetailScreen';
import { BottomNav, TabType } from './components/BottomNav';
import { TransactionModal } from './components/TransactionModal';
import { NotificationsModal } from './components/NotificationsModal';
import { HistoryModal } from './components/HistoryModal';
import { SideDrawer } from './components/SideDrawer';
import { AvatarModal } from './components/AvatarModal';
import { AdminPanel } from './components/AdminPanel';
import { CreateGoalModal } from './components/CreateGoalModal';
import { CreateParticipantModal } from './components/CreateParticipantModal';
import { LoginScreen } from './components/LoginScreen';
import { ConfirmDialog } from './components/ConfirmDialog';
import { IMAGES } from './constants/images';
import { triggerCelebration } from './utils/confetti';
import { ShieldCheck, Eye } from 'lucide-react';

export type ScreenView = 'home' | 'coronita-detail' | 'missions' | 'history' | 'admin';

export default function App() {
  // Participants State
  const [participants, setParticipants] = useState<Participant[]>(() => {
    const saved = localStorage.getItem('nossa_conquista_participants');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_PARTICIPANTS;
      }
    }
    return INITIAL_PARTICIPANTS;
  });

  // Application Goals State
  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('nossa_conquista_goals');
    if (saved) {
      try {
        const parsed: Goal[] = JSON.parse(saved);
        return parsed.map((g) => {
          const defaultGoal = INITIAL_GOALS.find((ig) => ig.id === g.id);
          return defaultGoal ? { ...g, imageUrl: g.imageUrl || defaultGoal.imageUrl } : g;
        });
      } catch {
        return INITIAL_GOALS;
      }
    }
    return INITIAL_GOALS;
  });

  // Monthly Budget State
  const [monthlyBudget, setMonthlyBudget] = useState<MonthlyBudget>(() => {
    const saved = localStorage.getItem('nossa_conquista_monthly_budget_v2');
    let budget: MonthlyBudget;
    if (saved) {
      try {
        budget = JSON.parse(saved);
      } catch {
        budget = INITIAL_MONTHLY_BUDGET;
      }
    } else {
      budget = INITIAL_MONTHLY_BUDGET;
    }

    if (!budget.budgets) {
      budget.budgets = {};
    }
    if (budget.edinaldo && !budget.budgets['edinaldo']) {
      budget.budgets['edinaldo'] = budget.edinaldo;
    }
    if (budget.coronita && !budget.budgets['coronita']) {
      budget.budgets['coronita'] = budget.coronita;
    }
    return budget;
  });

  // History State
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('nossa_conquista_history');
    if (saved) {
      try {
        const parsed: HistoryItem[] = JSON.parse(saved);
        return parsed.map((item) => ({
          ...item,
          title: item.title
            .replace(/1ª\s*quinzena/gi, 'Meta de Julho')
            .replace(/2ª\s*quinzena/gi, 'Meta de Junho')
            .replace(/quinzenal/gi, 'mensal')
            .replace(/quinzena/gi, 'mês')
            .replace(/quizena/gi, 'mês'),
        }));
      } catch {
        return INITIAL_HISTORY;
      }
    }
    return INITIAL_HISTORY;
  });

  // Notifications State
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('nossa_conquista_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Couple Profile State
  const [couple, setCouple] = useState<CoupleProfile>(() => {
    const saved = localStorage.getItem('nossa_conquista_couple_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const p1Avatar =
          parsed.partner1?.avatar && !parsed.partner1.avatar.includes('googleusercontent')
            ? parsed.partner1.avatar
            : IMAGES.edinaldoProfile;
        const p2Avatar =
          parsed.partner2?.avatar && !parsed.partner2.avatar.includes('googleusercontent')
            ? parsed.partner2.avatar
            : IMAGES.coronitaAvatar;

        return {
          ...parsed,
          partner1: {
            ...parsed.partner1,
            avatar: p1Avatar,
          },
          partner2: {
            ...parsed.partner2,
            avatar: p2Avatar,
          },
        };
      } catch {
        return INITIAL_COUPLE;
      }
    }
    return INITIAL_COUPLE;
  });

  // App Mode (Visualizador vs Painel Admin)
  const [appMode, setAppMode] = useState<AppMode>('viewer');

  // Authentication State
  const [currentUser, setCurrentUser] = useState<{
    role: 'admin' | 'user';
    name: string;
    participantId?: string;
  } | null>(() => {
    const saved = localStorage.getItem('nossa_conquista_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  // Navigation State
  const [activeScreen, setActiveScreen] = useState<ScreenView>('home');
  const [selectedGoal, setSelectedGoal] = useState<Goal>(goals[1] || goals[0]);
  const [missionsInitialTab, setMissionsInitialTab] = useState<'ranking' | 'coronita' | 'edinaldo' | 'conjunto' | 'duelo'>('ranking');

  // Modals State
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [modalDefaultPerson, setModalDefaultPerson] = useState<string>('Coronita');
  const [modalDefaultGoalId, setModalDefaultGoalId] = useState<string>('');
  const [modalDefaultMode, setModalDefaultMode] = useState<'deposit' | 'expense'>('deposit');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(false);

  // Admin Modals
  const [isCreateGoalOpen, setIsCreateGoalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [isCreateParticipantOpen, setIsCreateParticipantOpen] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);

  // Avatar Modal State
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [avatarModalPerson, setAvatarModalPerson] = useState<string>('Edinaldo');

  // Custom Confirmation Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const askConfirmation = (title: string, message: string, onConfirm: () => void) => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      onConfirm,
    });
  };

  // Local Storage Synchronizations
  useEffect(() => {
    localStorage.setItem('nossa_conquista_participants', JSON.stringify(participants));
  }, [participants]);

  useEffect(() => {
    localStorage.setItem('nossa_conquista_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('nossa_conquista_monthly_budget_v2', JSON.stringify(monthlyBudget));
  }, [monthlyBudget]);

  useEffect(() => {
    localStorage.setItem('nossa_conquista_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('nossa_conquista_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('nossa_conquista_couple_v3', JSON.stringify(couple));
  }, [couple]);

  // Synchronize participants with monthly budget entries
  useEffect(() => {
    setMonthlyBudget((prev) => {
      const updatedBudgets = { ...prev.budgets };
      let changed = false;

      participants.forEach((p) => {
        const key = p.name.toLowerCase();
        const userGoal = goals.find((g) => g.owner.toLowerCase() === key);
        const goalTitle = userGoal ? userGoal.title : `Meta de ${p.name}`;

        if (!updatedBudgets[key]) {
          updatedBudgets[key] = {
            name: p.name,
            participantId: p.id,
            goalTitle,
            targetAllowance: p.monthlyAllowance,
            expenses: [],
          };
          changed = true;
        } else {
          if (
            updatedBudgets[key].targetAllowance !== p.monthlyAllowance ||
            updatedBudgets[key].goalTitle !== goalTitle ||
            updatedBudgets[key].name !== p.name
          ) {
            updatedBudgets[key] = {
              ...updatedBudgets[key],
              name: p.name,
              targetAllowance: p.monthlyAllowance,
              goalTitle,
            };
            changed = true;
          }
        }
      });

      if (changed) {
        return {
          ...prev,
          budgets: updatedBudgets,
        };
      }
      return prev;
    });
  }, [participants, goals]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('nossa_conquista_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('nossa_conquista_user');
    }
  }, [currentUser]);

  // Calculations
  const totalTarget = goals.reduce((acc, g) => acc + g.targetAmount, 0);
  const totalCurrent = goals.reduce((acc, g) => acc + g.currentAmount, 0);

  const coronitaSpent = monthlyBudget.coronita
    ? monthlyBudget.coronita.expenses.reduce((acc, curr) => acc + curr.amount, 0)
    : 0;
  const coronitaAllowanceRemaining = Math.max(
    0,
    (monthlyBudget.coronita?.targetAllowance || 600) - coronitaSpent
  );

  const edinaldoSpent = monthlyBudget.edinaldo
    ? monthlyBudget.edinaldo.expenses.reduce((acc, curr) => acc + curr.amount, 0)
    : 0;
  const edinaldoAllowanceRemaining = Math.max(
    0,
    (monthlyBudget.edinaldo?.targetAllowance || 400) - edinaldoSpent
  );

  // Navigation Handlers
  const handleSelectGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    setActiveScreen('coronita-detail');
  };

  const handleOpenAddExpense = (person: string = 'Coronita') => {
    setModalDefaultPerson(person);
    setModalDefaultMode('expense');
    setIsTransactionModalOpen(true);
  };

  const handleOpenAvatarModal = (person: string = 'Edinaldo') => {
    if (currentUser?.role === 'user' && currentUser.name.toLowerCase() !== person.toLowerCase()) {
      alert(`Você só pode alterar o avatar do seu próprio participante (${currentUser.name})!`);
      return;
    }
    setAvatarModalPerson(person);
    setIsAvatarModalOpen(true);
  };

  // Avatar Management
  const handleSaveAvatar = (person: string, newUrl: string) => {
    setCouple((prev) => {
      const p1Match =
        person.toLowerCase() === 'edinaldo' ||
        person.toLowerCase() === prev.partner1.name.toLowerCase();
      const p2Match =
        person.toLowerCase() === 'coronita' ||
        person.toLowerCase() === prev.partner2.name.toLowerCase();

      if (p1Match) {
        return {
          ...prev,
          partner1: {
            ...prev.partner1,
            avatar: newUrl,
          },
        };
      } else if (p2Match) {
        return {
          ...prev,
          partner2: {
            ...prev.partner2,
            avatar: newUrl,
          },
        };
      }
      return prev;
    });

    // Update in participants list as well
    setParticipants((prev) =>
      prev.map((p) =>
        p.name.toLowerCase() === person.toLowerCase() ? { ...p, avatar: newUrl } : p
      )
    );

    const newNotif: AppNotification = {
      id: `notif-avatar-${Date.now()}`,
      title: `Foto de ${person} Salva! 📸`,
      message: `A nova foto de perfil foi atualizada com sucesso no aplicativo.`,
      date: 'Agora',
      read: false,
      type: 'achievement',
      icon: '✨',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // ================= ADMIN & GOAL ACTIONS =================

  const handleSaveGoal = (goalData: Partial<Goal>) => {
    if (goalData.id) {
      // Edit existing
      setGoals((prev) =>
        prev.map((g) => (g.id === goalData.id ? ({ ...g, ...goalData } as Goal) : g))
      );
      if (selectedGoal?.id === goalData.id) {
        setSelectedGoal((prev) => ({ ...prev, ...goalData } as Goal));
      }
      const newNotif: AppNotification = {
        id: `notif-g-edit-${Date.now()}`,
        title: `Meta Atualizada! 🎯`,
        message: `As deliberações da meta "${goalData.title}" foram salvas pelo Admin.`,
        date: 'Agora',
        read: false,
        type: 'achievement',
        icon: '📝',
      };
      setNotifications((prev) => [newNotif, ...prev]);
    } else {
      // Create new goal
      const newGoal: Goal = {
        id: `goal-${Date.now()}`,
        title: goalData.title || 'Nova Meta',
        subtitle: goalData.subtitle,
        owner: goalData.owner || 'Participante',
        participantId: goalData.participantId,
        targetAmount: goalData.targetAmount || 5000,
        currentAmount: goalData.currentAmount || 0,
        monthlyTarget: goalData.monthlyTarget || 500,
        targetDate: goalData.targetDate || '31 DE DEZEMBRO DE 2026',
        daysRemaining: goalData.daysRemaining || 134,
        imageUrl: goalData.imageUrl || IMAGES.iphone15,
        accentColor: goalData.accentColor || '#3b82f6',
        category: goalData.category || 'tecnologia',
        description: goalData.description,
        streakDays: 1,
      };

      setGoals((prev) => [...prev, newGoal]);
      triggerCelebration();

      const newNotif: AppNotification = {
        id: `notif-g-new-${Date.now()}`,
        title: `Nova Meta Deliberada! 🚀`,
        message: `O Admin cadastrou a nova meta "${newGoal.title}" para ${newGoal.owner} no valor de R$ ${newGoal.targetAmount.toLocaleString('pt-BR')}.`,
        date: 'Agora',
        read: false,
        type: 'achievement',
        icon: '🎯',
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }
  };

  const handleDeleteGoal = (goalId: string) => {
    const targetGoal = goals.find((g) => g.id === goalId);
    if (!targetGoal) return;
    askConfirmation(
      'Excluir Meta 🎯',
      `Deseja realmente excluir a meta "${targetGoal.title}"? Todos os dados vinculados a ela serão removidos permanentemente.`,
      () => {
        setGoals((prev) => prev.filter((g) => g.id !== goalId));
        if (selectedGoal?.id === goalId) {
          setSelectedGoal(goals.find((g) => g.id !== goalId) || goals[0]);
        }
      }
    );
  };

  const handleSaveParticipant = (participantData: Partial<Participant>) => {
    if (participantData.id) {
      setParticipants((prev) =>
        prev.map((p) =>
          p.id === participantData.id ? ({ ...p, ...participantData } as Participant) : p
        )
      );
    } else {
      const newPart: Participant = {
        id: `part-${Date.now()}`,
        name: participantData.name || 'Novo Participante',
        role: participantData.role || 'Participante',
        avatar:
          participantData.avatar ||
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
        monthlyAllowance: participantData.monthlyAllowance || 500,
        color: participantData.color || '#3b82f6',
        bio: participantData.bio,
        password: participantData.password || '123456',
      };
      setParticipants((prev) => [...prev, newPart]);
      triggerCelebration();

      const newNotif: AppNotification = {
        id: `notif-part-${Date.now()}`,
        title: `Novo Participante Adicionado! 👥`,
        message: `${newPart.name} agora faz parte do sistema com limite mensal de R$ ${newPart.monthlyAllowance}.`,
        date: 'Agora',
        read: false,
        type: 'achievement',
        icon: '✨',
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }
  };

  const handleDeleteParticipant = (participantId: string) => {
    const targetPart = participants.find((p) => p.id === participantId);
    if (!targetPart) return;
    askConfirmation(
      'Remover Participante 👥',
      `Deseja remover o participante ${targetPart.name}? Suas metas e conquistas individuais salvas continuarão preservadas.`,
      () => {
        setParticipants((prev) => prev.filter((p) => p.id !== participantId));
      }
    );
  };

  const handleOpenAddDeposit = (preGoalId?: string) => {
    if (preGoalId) setModalDefaultGoalId(preGoalId);
    setModalDefaultMode('deposit');
    setIsTransactionModalOpen(true);
  };

  // Direct Local Image Updates from Admin
  const handleUpdateGoalImage = (goalId: string, newImage: string) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === goalId ? { ...g, imageUrl: newImage } : g))
    );
    if (selectedGoal?.id === goalId) {
      setSelectedGoal((prev) => (prev ? { ...prev, imageUrl: newImage } : prev));
    }
    const targetGoal = goals.find((g) => g.id === goalId);
    const newNotif: AppNotification = {
      id: `notif-img-${Date.now()}`,
      title: `Imagem da Meta Atualizada! 📸`,
      message: `A imagem da meta "${targetGoal?.title || 'Meta'}" foi atualizada pelo Admin com sucesso.`,
      date: 'Agora',
      read: false,
      type: 'achievement',
      icon: '🖼️',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleUpdateParticipantAvatar = (participantId: string, newAvatar: string) => {
    const target = participants.find((p) => p.id === participantId);
    if (target) {
      handleSaveAvatar(target.name, newAvatar);
    } else {
      setParticipants((prev) =>
        prev.map((p) => (p.id === participantId ? { ...p, avatar: newAvatar } : p))
      );
    }
  };

  // Quick Deposit Action
  const handleQuickDeposit = (goalId: string, amount: number, title: string) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === goalId ? { ...g, currentAmount: g.currentAmount + amount } : g))
    );

    const targetGoal = goals.find((g) => g.id === goalId);
    const newHist: HistoryItem = {
      id: `hist-quick-${Date.now()}`,
      title,
      goalId,
      goalTitle: targetGoal?.title || 'Meta Deliberada',
      amount,
      date: 'Hoje',
      type: 'deposit',
      emoji: '💰',
      participantName: targetGoal?.owner,
    };
    setHistory((prev) => [newHist, ...prev]);
    triggerCelebration();

    const newNotif: AppNotification = {
      id: `notif-quick-dep-${Date.now()}`,
      title: `Aporte do Admin (+R$ ${amount}) 👑`,
      message: `Creditado com sucesso na meta "${targetGoal?.title || 'Meta'}" de ${targetGoal?.owner}.`,
      date: 'Agora',
      read: false,
      type: 'achievement',
      icon: '💵',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Add Deposit from modal
  const handleAddDeposit = (goalId: string, amount: number, note: string) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === goalId ? { ...g, currentAmount: g.currentAmount + amount } : g))
    );

    const targetGoal = goals.find((g) => g.id === goalId);
    const newHistoryItem: HistoryItem = {
      id: `hist-${Date.now()}`,
      title: note,
      goalId,
      goalTitle: targetGoal?.title || 'Meta Deliberada',
      amount,
      date: 'Hoje',
      type: 'deposit',
      emoji: '💰',
      participantName: targetGoal?.owner,
    };
    setHistory((prev) => [newHistoryItem, ...prev]);

    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Aporte Registrado! 🚀',
      message: `Você adicionou R$ ${amount} para ${targetGoal?.title || 'sua meta'}.`,
      date: 'Agora',
      read: false,
      type: 'achievement',
      icon: '💵',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Register Expense
  const handleAddExpense = (
    targetPerson: string,
    description: string,
    amount: number,
    category: ExpenseItem['category'],
    note?: string,
    goalId?: string
  ) => {
    const key = targetPerson.toLowerCase();
    const chosenGoal = goalId ? goals.find((g) => g.id === goalId) : null;
    const finalNote = note || (chosenGoal ? `Descontado da meta ${chosenGoal.title}` : `Descontado do orçamento de ${targetPerson}`);

    const newExpense: ExpenseItem = {
      id: `exp-${Date.now()}`,
      targetPerson,
      description,
      amount,
      date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' }),
      category,
      registeredBy: currentUser?.name || 'Admin',
      note: finalNote,
    };

    setMonthlyBudget((prev) => {
      const updatedBudgets = { ...prev.budgets };
      if (updatedBudgets[key]) {
        updatedBudgets[key] = {
          ...updatedBudgets[key],
          expenses: [newExpense, ...updatedBudgets[key].expenses],
        };
      } else {
        const targetPart = participants.find((p) => p.name.toLowerCase() === key);
        updatedBudgets[key] = {
          name: targetPerson,
          participantId: targetPart?.id,
          goalTitle: chosenGoal?.title || `Meta de ${targetPerson}`,
          targetAllowance: targetPart?.monthlyAllowance || 500,
          expenses: [newExpense],
        };
      }

      return {
        ...prev,
        budgets: updatedBudgets,
        edinaldo: key === 'edinaldo' ? updatedBudgets[key] : prev.edinaldo,
        coronita: key === 'coronita' ? updatedBudgets[key] : prev.coronita,
      };
    });

    const targetGoal = chosenGoal || goals.find((g) => g.owner.toLowerCase() === key);
    if (targetGoal) {
      setGoals((prev) =>
        prev.map((g) => (g.id === targetGoal.id ? { ...g, currentAmount: Math.max(0, g.currentAmount - amount) } : g))
      );
    }

    const categoryEmojis: Record<ExpenseItem['category'], string> = {
      alimentacao: '🍔',
      compras: '🛍️',
      beleza: '💅',
      lazer: '🎬',
      tecnologia: '🎧',
      outros: '📦',
    };

    const historyGoal = targetGoal || goals[0];

    const newHistoryItem: HistoryItem = {
      id: `hist-exp-${Date.now()}`,
      title: `Gasto (${targetPerson}): ${description}`,
      goalId: historyGoal?.id || 'goal-1',
      goalTitle: historyGoal?.title || 'Meta',
      amount,
      date: 'Hoje',
      type: 'expense',
      emoji: categoryEmojis[category] || '💸',
      participantName: targetPerson,
    };
    setHistory((prev) => [newHistoryItem, ...prev]);

    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: `Despesa de ${targetPerson} (-R$ ${amount.toFixed(2)}) ⚠️`,
      message: `Gasto de "${description}" registrado.${chosenGoal ? ` Descontado diretamente da meta ${chosenGoal.title}.` : ' Descontado do orçamento mensal.'}`,
      date: 'Agora',
      read: false,
      type: 'expense',
      icon: '📉',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleDeleteExpense = (person: string, expenseId: string) => {
    const key = person.toLowerCase();
    const budgetEntry = monthlyBudget.budgets?.[key] || (key === 'edinaldo' ? monthlyBudget.edinaldo : key === 'coronita' ? monthlyBudget.coronita : null);
    const targetExpense = budgetEntry?.expenses.find((e) => e.id === expenseId);
    const expDesc = targetExpense ? `"${targetExpense.description}"` : 'esta despesa';

    askConfirmation(
      'Remover Gasto 📉',
      `Deseja realmente remover o gasto ${expDesc}? O valor correspondente será restituído ao saldo do orçamento.`,
      () => {
        let removedExpense: ExpenseItem | undefined;
        setMonthlyBudget((prev) => {
          const updatedBudgets = { ...prev.budgets };
          if (updatedBudgets[key]) {
            removedExpense = updatedBudgets[key].expenses.find((e) => e.id === expenseId);
            updatedBudgets[key] = {
              ...updatedBudgets[key],
              expenses: updatedBudgets[key].expenses.filter((e) => e.id !== expenseId),
            };
          }

          return {
            ...prev,
            budgets: updatedBudgets,
            edinaldo: key === 'edinaldo' ? updatedBudgets[key] : prev.edinaldo,
            coronita: key === 'coronita' ? updatedBudgets[key] : prev.coronita,
          };
        });

        if (targetExpense) {
          const targetGoal = goals.find((g) => g.owner.toLowerCase() === key);
          if (targetGoal) {
            setGoals((prev) =>
              prev.map((g) =>
                g.id === targetGoal.id ? { ...g, currentAmount: Math.min(g.targetAmount, g.currentAmount + targetExpense.amount) } : g
              )
            );
          }

          const newNotif: AppNotification = {
            id: `notif-del-${Date.now()}`,
            title: `Despesa Estornada (${person}) 🔄`,
            message: `A despesa de "${targetExpense.description}" (R$ ${targetExpense.amount}) foi estornada com sucesso.`,
            date: 'Agora',
            read: false,
            type: 'achievement',
            icon: '✨',
          };
          setNotifications((prev) => [newNotif, ...prev]);
        }
      }
    );
  };

  const onCloseMonthAndDeposit = (person: string) => {
    const closeForParticipant = (pName: string) => {
      const key = pName.toLowerCase();
      const budgetEntry = monthlyBudget.budgets?.[key] || (key === 'edinaldo' ? monthlyBudget.edinaldo : key === 'coronita' ? monthlyBudget.coronita : null);
      if (!budgetEntry) return;

      const spent = (budgetEntry.expenses || []).reduce((acc, curr) => acc + curr.amount, 0);
      const targetAllowance = budgetEntry.targetAllowance;

      if (targetAllowance > 0) {
        // Find their goal to deposit
        const userGoal = goals.find((g) => g.owner.toLowerCase() === key);
        if (userGoal) {
          setGoals((prev) =>
            prev.map((g) => {
              if (g.id !== userGoal.id) return g;
              return {
                ...g,
                currentAmount: Math.min(g.targetAmount, g.currentAmount + targetAllowance),
              };
            })
          );

          const newHist: HistoryItem = {
            id: `hist-save-${key}-${Date.now()}`,
            title: `Orçamento Mensal Consolidado ${pName} (${monthlyBudget.monthName})`,
            goalId: userGoal.id,
            goalTitle: userGoal.title,
            amount: targetAllowance,
            date: 'Hoje',
            type: 'mission_reward',
            emoji: '🏆',
            participantName: pName,
          };
          setHistory((prev) => [newHist, ...prev]);
        }

        // Clear expenses for this participant for the next month
        setMonthlyBudget((prev) => {
          const updatedBudgets = { ...prev.budgets };
          if (updatedBudgets[key]) {
            updatedBudgets[key] = {
              ...updatedBudgets[key],
              expenses: [],
            };
          }
          return {
            ...prev,
            budgets: updatedBudgets,
            edinaldo: key === 'edinaldo' ? updatedBudgets[key] : prev.edinaldo,
            coronita: key === 'coronita' ? updatedBudgets[key] : prev.coronita,
          };
        });
      }
    };

    if (person === 'Ambos' || person === 'Todos') {
      participants.forEach((p) => {
        closeForParticipant(p.name);
      });
    } else {
      closeForParticipant(person);
    }
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleResetData = () => {
    askConfirmation(
      'Restaurar Dados de Fábrica 🔄',
      'Tem certeza de que deseja restaurar todos os dados do sistema para o estado inicial de exemplo?',
      () => {
        localStorage.clear();
        setGoals(INITIAL_GOALS);
        setParticipants(INITIAL_PARTICIPANTS);
        setMonthlyBudget(INITIAL_MONTHLY_BUDGET);
        setHistory(INITIAL_HISTORY);
        setNotifications(INITIAL_NOTIFICATIONS);
        setCouple(INITIAL_COUPLE);
        setAppMode('viewer');
        setActiveScreen('home');
      }
    );
  };

  const handleTabSelect = (tab: TabType) => {
    setIsHistoryModalOpen(false);
    setIsNotificationsOpen(false);
    setIsSideDrawerOpen(false);

    if (tab === 'home') {
      setActiveScreen('home');
      setAppMode('viewer');
    } else if (tab === 'goals') {
      const isUser = currentUser?.role === 'user';
      const userGoals = isUser 
        ? goals.filter(g => g.owner.toLowerCase() === currentUser?.name.toLowerCase())
        : goals;
      setSelectedGoal(userGoals[0] || goals[0]);
      setActiveScreen('coronita-detail');
      setAppMode('viewer');
    } else if (tab === 'missions') {
      setMissionsInitialTab('ranking');
      setActiveScreen('missions');
      setAppMode('viewer');
    } else if (tab === 'history') {
      setIsHistoryModalOpen(true);
    } else if (tab === 'profile') {
      setIsSideDrawerOpen(true);
    }
  };

  const currentTab: TabType =
    activeScreen === 'home'
      ? 'home'
      : activeScreen === 'coronita-detail'
      ? 'goals'
      : activeScreen === 'missions'
      ? 'missions'
      : 'home';

  if (!currentUser) {
    return (
      <LoginScreen
        participants={participants}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          if (user.role === 'admin') {
            setAppMode('admin');
            setActiveScreen('admin');
          } else {
            setAppMode('viewer');
            setActiveScreen('home');
          }
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#070514] text-white flex flex-col items-center justify-start relative overflow-x-hidden font-sans">
      {/* Background Starry Dust */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
        <div className="absolute top-10 left-10 w-1 h-1 bg-white rounded-full shadow-[0_0_5px_#fff]"></div>
        <div className="absolute top-20 right-20 w-1.5 h-1.5 bg-blue-300 rounded-full shadow-[0_0_8px_#93c5fd]"></div>
        <div className="absolute top-40 left-1/2 w-1 h-1 bg-purple-300 rounded-full shadow-[0_0_6px_#d8b4fe]"></div>
        <div className="absolute top-72 left-8 w-1 h-1 bg-yellow-200 rounded-full shadow-[0_0_5px_#fef08a]"></div>
        <div className="absolute top-96 right-12 w-2 h-2 bg-pink-400 rounded-full shadow-[0_0_10px_#f472b6]"></div>
      </div>

      {/* Persistent Mode Switcher Bar */}
      {currentUser?.role === 'admin' && (
        <div className="w-full max-w-4xl px-3 sm:px-4 pt-2.5 pb-1 flex items-center justify-between z-40 bg-[#070514]/90 backdrop-blur sticky top-0 border-b border-white/5 gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => {
                setAppMode('viewer');
                setActiveScreen('home');
              }}
              className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold transition-all shrink-0 ${
                appMode === 'viewer' && activeScreen === 'home'
                  ? 'bg-[#d81b60] text-white shadow-glow-pink'
                  : 'bg-[#1c143d] text-[#a098c4] hover:text-white'
              }`}
            >
              Início
            </button>
            <button
              onClick={() => {
                setAppMode('viewer');
                setActiveScreen('missions');
              }}
              className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold transition-all shrink-0 ${
                appMode === 'viewer' && activeScreen === 'missions'
                  ? 'bg-[#d81b60] text-white shadow-glow-pink'
                  : 'bg-[#1c143d] text-[#a098c4] hover:text-white'
              }`}
            >
              Ranking 🏆
            </button>
            <button
              onClick={() => {
                setAppMode('viewer');
                setSelectedGoal(goals[1] || goals[0]);
                setActiveScreen('coronita-detail');
              }}
              className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold transition-all shrink-0 ${
                appMode === 'viewer' && activeScreen === 'coronita-detail'
                  ? 'bg-[#d81b60] text-white shadow-glow-pink'
                  : 'bg-[#1c143d] text-[#a098c4] hover:text-white'
              }`}
            >
              Metas
            </button>
          </div>

          {/* Dedicated Admin Panel Access Button */}
          <button
            onClick={() => {
              if (appMode === 'admin') {
                setAppMode('viewer');
                setActiveScreen('home');
              } else {
                setAppMode('admin');
                setActiveScreen('admin');
              }
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold border transition-all shrink-0 shadow-md ${
              appMode === 'admin'
                ? 'bg-gradient-to-r from-[#2563eb] to-[#3b82f6] text-white border-blue-400'
                : 'bg-[#1e1b4b] text-[#c084fc] border-[#c084fc]/40 hover:bg-[#311042]'
            }`}
          >
            {appMode === 'admin' ? (
              <>
                <Eye className="w-3 h-3 text-[#ffeb3b]" /> Modo Visual
              </>
            ) : (
              <>
                <ShieldCheck className="w-3 h-3 text-[#ffeb3b]" /> Painel Admin 👑
              </>
            )}
          </button>
        </div>
      )}

      {/* Main Container / Views */}
      <div className={`w-full ${appMode === 'admin' ? 'max-w-4xl' : 'max-w-md'} px-3 sm:px-4 relative z-10 flex-1 transition-all`}>
        {/* ADMIN MODE VIEW */}
        {appMode === 'admin' ? (
          <AdminPanel
            goals={goals}
            participants={participants}
            history={history}
            onOpenCreateGoal={() => {
              setEditingGoal(null);
              setIsCreateGoalOpen(true);
            }}
            onEditGoal={(goal) => {
              setEditingGoal(goal);
              setIsCreateGoalOpen(true);
            }}
            onDeleteGoal={handleDeleteGoal}
            onOpenCreateParticipant={() => {
              setEditingParticipant(null);
              setIsCreateParticipantOpen(true);
            }}
            onEditParticipant={(part) => {
              setEditingParticipant(part);
              setIsCreateParticipantOpen(true);
            }}
            onDeleteParticipant={handleDeleteParticipant}
            onOpenAddDeposit={(preGoalId) => {
              if (preGoalId) setModalDefaultGoalId(preGoalId);
              setModalDefaultMode('deposit');
              setIsTransactionModalOpen(true);
            }}
            onOpenAddExpense={handleOpenAddExpense}
            onSwitchToViewerMode={() => {
              setAppMode('viewer');
              setActiveScreen('home');
            }}
            onResetData={handleResetData}
            onQuickDeposit={handleQuickDeposit}
            onUpdateGoalImage={handleUpdateGoalImage}
            onUpdateParticipantAvatar={handleUpdateParticipantAvatar}
          />
        ) : (
          /* PARTICIPANT / VIEWER MODE VIEWS */
          <>
            {activeScreen === 'home' && (
              (() => {
                const isUser = currentUser?.role === 'user';
                const displayedGoals = isUser 
                  ? goals.filter(g => g.owner.toLowerCase() === currentUser?.name.toLowerCase())
                  : goals;
                const displayedTarget = isUser
                  ? displayedGoals.reduce((sum, g) => sum + g.targetAmount, 0)
                  : totalTarget;
                const displayedCurrent = isUser
                  ? displayedGoals.reduce((sum, g) => sum + g.currentAmount, 0)
                  : totalCurrent;
                return (
                  <HomeScreen
                    goals={displayedGoals}
                    participants={participants}
                    totalTarget={displayedTarget}
                    totalCurrent={displayedCurrent}
                    onSelectGoal={handleSelectGoal}
                    onOpenMissions={() => setActiveScreen('missions')}
                    onOpenNotifications={() => setIsNotificationsOpen(true)}
                    onOpenMenu={() => setIsSideDrawerOpen(true)}
                    onOpenAdmin={currentUser?.role === 'admin' ? () => {
                      setAppMode('admin');
                      setActiveScreen('admin');
                    } : undefined}
                    onOpenCreateGoal={currentUser?.role === 'admin' ? () => {
                      setEditingGoal(null);
                      setIsCreateGoalOpen(true);
                    } : undefined}
                  />
                );
              })()
            )}

            {activeScreen === 'missions' && (
              <MissionsScreen
                goals={goals}
                participants={participants}
                monthlyBudget={monthlyBudget}
                couple={couple}
                onBack={() => setActiveScreen('home')}
                onSelectGoal={handleSelectGoal}
                onOpenAddDeposit={currentUser?.role === 'admin' ? (goalId) => handleOpenAddDeposit(goalId) : undefined}
                onOpenAddExpense={currentUser?.role === 'admin' ? handleOpenAddExpense : undefined}
                onDeleteExpense={currentUser?.role === 'admin' ? handleDeleteExpense : undefined}
                onCloseMonthAndDeposit={currentUser?.role === 'admin' ? onCloseMonthAndDeposit : undefined}
                onOpenAvatarModal={handleOpenAvatarModal}
                initialTab={missionsInitialTab}
                isAdmin={currentUser?.role === 'admin'}
              />
            )}

            {activeScreen === 'coronita-detail' && (
              (() => {
                const isUser = currentUser?.role === 'user';
                const displayedGoals = isUser 
                  ? goals.filter(g => g.owner.toLowerCase() === currentUser?.name.toLowerCase())
                  : goals;
                
                // Safety check: if selectedGoal does not belong to the user, pass null to trigger the fallback!
                const safeSelectedGoal = isUser && selectedGoal && selectedGoal.owner.toLowerCase() !== currentUser?.name.toLowerCase()
                  ? null
                  : selectedGoal;

                return (
                  <GoalDetailScreen
                    goal={safeSelectedGoal}
                    goals={displayedGoals}
                    history={history}
                    participants={participants}
                    couple={couple}
                    onSelectGoal={(g) => setSelectedGoal(g)}
                    onBack={() => setActiveScreen('home')}
                    onViewFullHistory={() => setIsHistoryModalOpen(true)}
                    onAddDeposit={currentUser?.role === 'admin' ? () => setIsTransactionModalOpen(true) : undefined}
                    onOpenAvatarModal={(pName) => handleOpenAvatarModal(pName)}
                    isAdmin={currentUser?.role === 'admin'}
                  />
                );
              })()
            )}
          </>
        )}
      </div>

      {/* Persistent Bottom Tab Bar (Viewer Mode) */}
      {appMode === 'viewer' && (
        <BottomNav
          currentTab={currentTab}
          onSelectTab={handleTabSelect}
          onOpenAddModal={() => setIsTransactionModalOpen(true)}
          activeScreen={activeScreen}
          couple={couple}
          isAdmin={currentUser?.role === 'admin'}
        />
      )}

      {/* Interactive Modals */}
      <TransactionModal
        isOpen={isTransactionModalOpen}
        goals={goals}
        participants={participants}
        onClose={() => setIsTransactionModalOpen(false)}
        onAddDeposit={handleAddDeposit}
        onAddExpense={handleAddExpense}
        edinaldoAllowanceRemaining={edinaldoAllowanceRemaining}
        coronitaAllowanceRemaining={coronitaAllowanceRemaining}
        defaultPerson={modalDefaultPerson}
        defaultGoalId={modalDefaultGoalId}
        defaultMode={modalDefaultMode}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        notifications={notifications}
        onClose={() => setIsNotificationsOpen(false)}
        onMarkAllAsRead={handleMarkAllAsRead}
      />

      <HistoryModal
        isOpen={isHistoryModalOpen}
        history={currentUser?.role === 'user'
          ? history.filter(h => 
              (h.participantName && h.participantName.toLowerCase() === currentUser.name.toLowerCase()) ||
              (() => {
                const itemGoal = goals.find(g => g.id === h.goalId);
                return itemGoal && itemGoal.owner.toLowerCase() === currentUser.name.toLowerCase();
              })()
            )
          : history
        }
        onClose={() => setIsHistoryModalOpen(false)}
      />

      <SideDrawer
        isOpen={isSideDrawerOpen}
        onClose={() => setIsSideDrawerOpen(false)}
        couple={couple}
        goals={currentUser?.role === 'user'
          ? goals.filter((g) => g.owner.toLowerCase() === currentUser?.name.toLowerCase())
          : goals
        }
        onSelectGoal={(goal) => {
          setSelectedGoal(goal);
          setActiveScreen('coronita-detail');
        }}
        onSelectScreen={(screen) => {
          if (screen === 'history') setIsHistoryModalOpen(true);
          else if (screen === 'admin') {
            if (currentUser?.role === 'admin') {
              setAppMode('admin');
              setActiveScreen('admin');
            } else {
              alert('Apenas o Administrador pode acessar o Painel Admin!');
            }
          } else setActiveScreen(screen);
        }}
        onResetData={handleResetData}
        onOpenAvatarModal={handleOpenAvatarModal}
        onOpenAdmin={() => {
          if (currentUser?.role === 'admin') {
            setAppMode('admin');
            setActiveScreen('admin');
          } else {
            alert('Apenas o Administrador pode acessar o Painel Admin!');
          }
        }}
        isAdmin={currentUser?.role === 'admin'}
        onLogout={() => setCurrentUser(null)}
      />

      {/* Individual Avatar Editor Modal */}
      <AvatarModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        person={avatarModalPerson}
        currentAvatar={
          participants.find((p) => p.name.toLowerCase() === avatarModalPerson.toLowerCase())?.avatar ||
          (avatarModalPerson.toLowerCase() === 'edinaldo'
            ? couple.partner1.avatar || IMAGES.edinaldoProfile
            : couple.partner2.avatar || IMAGES.coronitaAvatar)
        }
        onSaveAvatar={handleSaveAvatar}
      />

      {/* Admin Goal Creation/Editing Modal */}
      <CreateGoalModal
        isOpen={isCreateGoalOpen}
        onClose={() => {
          setIsCreateGoalOpen(false);
          setEditingGoal(null);
        }}
        onSaveGoal={handleSaveGoal}
        participants={participants}
        editingGoal={editingGoal}
      />

      {/* Admin Participant Creation/Editing Modal */}
      <CreateParticipantModal
        isOpen={isCreateParticipantOpen}
        onClose={() => {
          setIsCreateParticipantOpen(false);
          setEditingParticipant(null);
        }}
        onSaveParticipant={handleSaveParticipant}
        editingParticipant={editingParticipant}
      />

      {/* Global Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
