Rails.application.routes.draw do
  devise_for :users, controllers: {
    confirmations: "users/confirmations",
    invitations: 'users/invitations',
    passwords: "users/passwords",
    registrations: "users/registrations",
    sessions: "users/sessions",
    unlocks: "users/unlocks"
  }
  resources :lists, only: [:index, :show, :create, :edit, :update, :destroy]
  resources :items, only: [:create, :edit, :update, :destroy]
  resources :users_lists, only: [:new, :create] do
    get :accept_list, on: :collection
    get :reject_list, on: :collection
  end
  root to: "lists#index"
end
