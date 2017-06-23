Rails.application.routes.draw do
  devise_for :users, controllers: { registrations: "registrations" }
  resources :lists, only: [:index, :show, :create, :edit, :update, :destroy]
  resources :items, only: [:create, :edit, :update, :destroy] do
    get :autocomplete, on: :collection
  end
  resources :users_lists, only: [:new, :create]
  root to: "lists#index"
end
