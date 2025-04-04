import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../UpdateUserDialog', () => ({
  UpdateUserDialog: () => <div>UpdateUserDialog</div>,
}));
vi.mock('../AddNewScreenshotDialog', () => ({
  AddNewScreenshotDialog: () => <div>AddNewScreenshotDialog</div>,
}));
vi.mock('../AddNewUserDialog', () => ({
  AddNewUserDialog: () => <div>AddNewUserDialog</div>,
}));
vi.mock('../DeleteUserDialog', () => ({
  DeleteUserDialog: () => <div>DeleteUserDialog</div>,
}));
vi.mock('../DeleteUserScreenshotDialog', () => ({
  DeleteUserScreenshotDialog: () => <div>DeleteUserScreenshotDialog</div>,
}));
vi.mock('../ScreenshotDialog', () => ({
  ScreenshotDialog: () => <div>ScreenshotDialog</div>,
}));

describe('Dialogs component', () => {
  beforeEach(() => {
    // Reset all mocks before each test to avoid state leaks
    vi.resetModules();
  });

  it('renders only UpdateUserDialog when updateUserInfoShowDialog is true', async () => {
    vi.doMock('../stores/updateUserInfoStore', () => ({
      useUpdateUserInfoStore: vi.fn((selector) =>
        selector({
          props: { showDialog: true },
          actions: { setShowDialog: vi.fn() },
        })
      ),
    }));
    vi.doMock('../stores/screenshotStore', () => ({
      useScreenshotStore: vi.fn((selector) =>
        selector({
          props: { showDialog: false },
          actions: { setShowDialog: vi.fn() },
        })
      ),
    }));
    vi.doMock('../stores/addNewScreenshotStore', () => ({
      useAddNewScreenshotStore: vi.fn((selector) =>
        selector({
          props: { showDialog: false },
          actions: { setShowDialog: vi.fn() },
        })
      ),
    }));
    vi.doMock('../stores/deleteUserScreenshotStore', () => ({
      useDeleteUserScreenshotStore: vi.fn((selector) =>
        selector({
          props: { showDialog: false },
          actions: { setShowDialog: vi.fn() },
        })
      ),
    }));
    vi.doMock('../stores/deleteUserStore', () => ({
      useDeleteUserStore: vi.fn((selector) =>
        selector({
          props: { showDialog: false },
          actions: { setShowDialog: vi.fn() },
        })
      ),
    }));
    vi.doMock('../stores/addNewUserStore', () => ({
      useAddNewUserStore: vi.fn((selector) =>
        selector({
          props: { showDialog: false },
          actions: { setShowDialog: vi.fn() },
        })
      ),
    }));

    const { Dialogs } = await import('../Dialogs');
    render(<Dialogs />);

    expect(screen.getByText('UpdateUserDialog')).toBeInTheDocument();
    expect(
      screen.queryByText('AddNewScreenshotDialog')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('DeleteUserScreenshotDialog')
    ).not.toBeInTheDocument();
    expect(screen.queryByText('DeleteUserDialog')).not.toBeInTheDocument();
    expect(screen.queryByText('AddNewUserDialog')).not.toBeInTheDocument();
    expect(screen.queryByText('ScreenshotDialog')).not.toBeInTheDocument();
  });

  it('renders only ScreenshotDialog when screenshotShowDialog is true', async () => {
    vi.doMock('../stores/updateUserInfoStore', () => ({
      useUpdateUserInfoStore: vi.fn((selector) =>
        selector({
          props: { showDialog: false },
          actions: { setShowDialog: vi.fn() },
        })
      ),
    }));
    vi.doMock('../stores/screenshotStore', () => ({
      useScreenshotStore: vi.fn((selector) =>
        selector({
          props: { showDialog: true },
          actions: { setShowDialog: vi.fn() },
        })
      ),
    }));
    vi.doMock('../stores/addNewScreenshotStore', () => ({
      useAddNewScreenshotStore: vi.fn((selector) =>
        selector({
          props: { showDialog: false },
          actions: { setShowDialog: vi.fn() },
        })
      ),
    }));
    vi.doMock('../stores/deleteUserScreenshotStore', () => ({
      useDeleteUserScreenshotStore: vi.fn((selector) =>
        selector({
          props: { showDialog: false },
          actions: { setShowDialog: vi.fn() },
        })
      ),
    }));
    vi.doMock('../stores/deleteUserStore', () => ({
      useDeleteUserStore: vi.fn((selector) =>
        selector({
          props: { showDialog: false },
          actions: { setShowDialog: vi.fn() },
        })
      ),
    }));
    vi.doMock('../stores/addNewUserStore', () => ({
      useAddNewUserStore: vi.fn((selector) =>
        selector({
          props: { showDialog: false },
          actions: { setShowDialog: vi.fn() },
        })
      ),
    }));

    const { Dialogs } = await import('../Dialogs');
    render(<Dialogs />);

    expect(screen.getByText('ScreenshotDialog')).toBeInTheDocument();
    expect(screen.queryByText('UpdateUserDialog')).not.toBeInTheDocument();
    expect(
      screen.queryByText('AddNewScreenshotDialog')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('DeleteUserScreenshotDialog')
    ).not.toBeInTheDocument();
    expect(screen.queryByText('DeleteUserDialog')).not.toBeInTheDocument();
    expect(screen.queryByText('AddNewUserDialog')).not.toBeInTheDocument();
  });

  it('renders only AddNewScreenshotDialog when addNewScreenshotShowDialog is true', async () => {
    vi.doMock('../stores/updateUserInfoStore', () => ({
      useUpdateUserInfoStore: vi.fn((selector) =>
        selector({
          props: { showDialog: false },
          actions: { setShowDialog: vi.fn() },
        })
      ),
    }));
    vi.doMock('../stores/screenshotStore', () => ({
      useScreenshotStore: vi.fn((selector) =>
        selector({
          props: { showDialog: false },
          actions: { setShowDialog: vi.fn() },
        })
      ),
    }));
    vi.doMock('../stores/addNewScreenshotStore', () => ({
      useAddNewScreenshotStore: vi.fn((selector) =>
        selector({
          props: { showDialog: true },
          actions: { setShowDialog: vi.fn() },
        })
      ),
    }));
    vi.doMock('../stores/deleteUserScreenshotStore', () => ({
      useDeleteUserScreenshotStore: vi.fn((selector) =>
        selector({
          props: { showDialog: false },
          actions: { setShowDialog: vi.fn() },
        })
      ),
    }));
    vi.doMock('../stores/deleteUserStore', () => ({
      useDeleteUserStore: vi.fn((selector) =>
        selector({
          props: { showDialog: false },
          actions: { setShowDialog: vi.fn() },
        })
      ),
    }));
    vi.doMock('../stores/addNewUserStore', () => ({
      useAddNewUserStore: vi.fn((selector) =>
        selector({
          props: { showDialog: false },
          actions: { setShowDialog: vi.fn() },
        })
      ),
    }));

    const { Dialogs } = await import('../Dialogs');
    render(<Dialogs />);

    expect(screen.getByText('AddNewScreenshotDialog')).toBeInTheDocument();
    expect(screen.queryByText('UpdateUserDialog')).not.toBeInTheDocument();
    expect(
      screen.queryByText('DeleteUserScreenshotDialog')
    ).not.toBeInTheDocument();
    expect(screen.queryByText('DeleteUserDialog')).not.toBeInTheDocument();
    expect(screen.queryByText('AddNewUserDialog')).not.toBeInTheDocument();
    expect(screen.queryByText('ScreenshotDialog')).not.toBeInTheDocument();
  });

  it('renders only DeleteUserScreenshotDialog when deleteUserScreenshotShowDialog is true', async () => {
    vi.doMock('../stores/updateUserInfoStore', () => ({
      useUpdateUserInfoStore: vi.fn((selector) =>
        selector({
          props: { showDialog: false },
          actions: { setShowDialog: vi.fn() },
        })
      ),
    }));
    vi.doMock('../stores/screenshotStore', () => ({
      useScreenshotStore: vi.fn((selector) =>
        selector({
          props: { showDialog: false },
          actions: { setShowDialog: vi.fn() },
        })
      ),
    }));
    vi.doMock('../stores/addNewScreenshotStore', () => ({
      useAddNewScreenshotStore: vi.fn((selector) =>
        selector({
          props: { showDialog: false },
          actions: { setShowDialog: vi.fn() },
        })
      ),
    }));
    vi.doMock('../stores/deleteUserScreenshotStore', () => ({
      useDeleteUserScreenshotStore: vi.fn((selector) =>
        selector({
          props: { showDialog: true },
          actions: { setShowDialog: vi.fn() },
        })
      ),
    }));
    vi.doMock('../stores/deleteUserStore', () => ({
      useDeleteUserStore: vi.fn((selector) =>
        selector({
          props: { showDialog: false },
          actions: { setShowDialog: vi.fn() },
        })
      ),
    }));
    vi.doMock('../stores/addNewUserStore', () => ({
      useAddNewUserStore: vi.fn((selector) =>
        selector({
          props: { showDialog: false },
          actions: { setShowDialog: vi.fn() },
        })
      ),
    }));

    const { Dialogs } = await import('../Dialogs');
    render(<Dialogs />);

    expect(screen.getByText('DeleteUserScreenshotDialog')).toBeInTheDocument();
    expect(screen.queryByText('UpdateUserDialog')).not.toBeInTheDocument();
    expect(
      screen.queryByText('AddNewScreenshotDialog')
    ).not.toBeInTheDocument();
    expect(screen.queryByText('ScreenshotDialog')).not.toBeInTheDocument();
    expect(screen.queryByText('DeleteUserDialog')).not.toBeInTheDocument();
    expect(screen.queryByText('AddNewUserDialog')).not.toBeInTheDocument();
  });

  it('renders only DeleteUserDialog when deleteUserShowDialog is true', async () => {
    vi.doMock('../stores/updateUserInfoStore', () => ({
      useUpdateUserInfoStore: vi.fn((selector) =>
        selector({
          props: { showDialog: false },
          actions: { setShowDialog: vi.fn() },
        })
      ),
    }));
    vi.doMock('../stores/screenshotStore', () => ({
      useScreenshotStore: vi.fn((selector) =>
        selector({
          props: { showDialog: false },
          actions: { setShowDialog: vi.fn() },
        })
      ),
    }));
    vi.doMock('../stores/addNewScreenshotStore', () => ({
      useAddNewScreenshotStore: vi.fn((selector) =>
        selector({
          props: { showDialog: false },
          actions: { setShowDialog: vi.fn() },
        })
      ),
    }));
    vi.doMock('../stores/deleteUserScreenshotStore', () => ({
      useDeleteUserScreenshotStore: vi.fn((selector) =>
        selector({
          props: { showDialog: false },
          actions: { setShowDialog: vi.fn() },
        })
      ),
    }));
    vi.doMock('../stores/deleteUserStore', () => ({
      useDeleteUserStore: vi.fn((selector) =>
        selector({
          props: { showDialog: true },
          actions: { setShowDialog: vi.fn() },
        })
      ),
    }));
    vi.doMock('../stores/addNewUserStore', () => ({
      useAddNewUserStore: vi.fn((selector) =>
        selector({
          props: { showDialog: false },
          actions: { setShowDialog: vi.fn() },
        })
      ),
    }));

    const { Dialogs } = await import('../Dialogs');
    render(<Dialogs />);

    expect(screen.getByText('DeleteUserDialog')).toBeInTheDocument();
    expect(screen.queryByText('UpdateUserDialog')).not.toBeInTheDocument();
    expect(
      screen.queryByText('AddNewScreenshotDialog')
    ).not.toBeInTheDocument();
    expect(screen.queryByText('ScreenshotDialog')).not.toBeInTheDocument();
    expect(
      screen.queryByText('DeleteUserScreenshotDialog')
    ).not.toBeInTheDocument();
    expect(screen.queryByText('AddNewUserDialog')).not.toBeInTheDocument();
  });

  it('renders only AddNewUserDialog when addNewUserShowDialog is true', async () => {
    vi.doMock('../stores/updateUserInfoStore', () => ({
      useUpdateUserInfoStore: vi.fn((selector) =>
        selector({
          props: { showDialog: false },
          actions: { setShowDialog: vi.fn() },
        })
      ),
    }));
    vi.doMock('../stores/screenshotStore', () => ({
      useScreenshotStore: vi.fn((selector) =>
        selector({
          props: { showDialog: false },
          actions: { setShowDialog: vi.fn() },
        })
      ),
    }));
    vi.doMock('../stores/addNewScreenshotStore', () => ({
      useAddNewScreenshotStore: vi.fn((selector) =>
        selector({
          props: { showDialog: false },
          actions: { setShowDialog: vi.fn() },
        })
      ),
    }));
    vi.doMock('../stores/deleteUserScreenshotStore', () => ({
      useDeleteUserScreenshotStore: vi.fn((selector) =>
        selector({
          props: { showDialog: false },
          actions: { setShowDialog: vi.fn() },
        })
      ),
    }));
    vi.doMock('../stores/deleteUserStore', () => ({
      useDeleteUserStore: vi.fn((selector) =>
        selector({
          props: { showDialog: false },
          actions: { setShowDialog: vi.fn() },
        })
      ),
    }));
    vi.doMock('../stores/addNewUserStore', () => ({
      useAddNewUserStore: vi.fn((selector) =>
        selector({
          props: { showDialog: true },
          actions: { setShowDialog: vi.fn() },
        })
      ),
    }));

    const { Dialogs } = await import('../Dialogs');
    render(<Dialogs />);

    expect(screen.getByText('AddNewUserDialog')).toBeInTheDocument();
    expect(screen.queryByText('UpdateUserDialog')).not.toBeInTheDocument();
    expect(
      screen.queryByText('AddNewScreenshotDialog')
    ).not.toBeInTheDocument();
    expect(screen.queryByText('ScreenshotDialog')).not.toBeInTheDocument();
    expect(
      screen.queryByText('DeleteUserScreenshotDialog')
    ).not.toBeInTheDocument();
    expect(screen.queryByText('DeleteUserDialog')).not.toBeInTheDocument();
  });
});
