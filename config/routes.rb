Rails.application.routes.draw do
  devise_for :users, controllers: { registrations: "registrations" }
  resources :lists, only: [:index, :show, :create, :edit, :update, :destroy]
  resources :items, only: [:create, :edit, :update, :destroy]
  resources :users_lists, only: [:new, :create]
  root to: "lists#index"
end
