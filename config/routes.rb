Rails.application.routes.draw do
  devise_for :users,
             controllers: {
               invitations: 'users/invitations',
               sessions: 'users/sessions',
               passwords: 'users/passwords'
             },
             skip: :registration
  as :user do
    get "/users" => "users/registrations#new", as: :new_user_registration
    post "/users" => "devise/registrations#create", as: :user_registration
  end
  resources :lists, only: [:index, :show, :create, :edit, :update, :destroy] do
    post :refresh_list, on: :member
    resources :items, only: [:create, :edit, :update, :destroy]
    resources :users_lists, only: [:new, :create] do
      get :accept_list, on: :collection
      get :reject_list, on: :collection
    end
  end
  root to: "lists#index"
end
