" Syntax Highlighting
if has("syntax")
	syntax on
endif

set autoindent
set cindent
set nu
set ts=4
set shiftwidth=4
set hlsearch
set lines=32 columns=120
set guifont=µ¸¿òÃ¼:h12

colorscheme jellybeans
" colorscheme torte

au BufReadPost *
\ if line("'\"") > 0 && line("'\"") <= line("$") |
\ exe "norm g`\"" |
\ endif

set laststatus=2
set statusline=%<%l:%v\ [%P]%=%a\ %h%m%r\ %F
