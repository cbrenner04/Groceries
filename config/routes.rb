Rails.application.routes.draw do
  devise_for :users,
             controllers: {
               invitations: 'users/invitations',
               sessions: 'users/sessions',
               passwords: 'users/passwords'
             },
             skip: :registration
  resources :lists, only: [:index, :show, :create, :edit, :update, :destroy] do
    post :refresh_list, on: :member
    resources :book_list_items, only: [:create, :edit, :update, :destroy]
    resources :grocery_list_items, only: [:create, :edit, :update, :destroy]
    resources :music_list_items, only: [:create, :edit, :update, :destroy]
    resources :to_do_list_items, only: [:create, :edit, :update, :destroy]
    resources :users_lists, only: [:index, :new, :create, :update]
  end
  resources :completed_lists, only: :index
  root to: "lists#index"
end
