Rails.application.routes.draw do
  mount_devise_token_auth_for 'User', at: 'auth', skip: [:invitations]
  devise_for :users,
             path: 'auth',
             only: [:invitations],
             controllers: {
               invitations: 'users/invitations',
             },
             skip: :registration
  resources :lists, only: [:index, :show, :create, :edit, :update, :destroy] do
    post :refresh_list, on: :member
    resources :book_list_items, only: [:create, :edit, :update, :destroy]
    resources :grocery_list_items, only: [:create, :edit, :update, :destroy]
    resources :music_list_items, only: [:create, :edit, :update, :destroy]
    resources :to_do_list_items, only: [:create, :edit, :update, :destroy]
    resources :users_lists, only: [:index, :show, :new, :create, :update]
  end
  resources :completed_lists, only: :index
  root to: "lists#index"
  get '*unmatched_route', to: 'application#route_not_found'
end
