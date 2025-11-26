
import React, { useState, useEffect, useCallback } from 'react';
import { Project, Domain, BM, Partnership, App as AppData, Profile, Page, View, DomainViewMode, ProfileRole, Integration, ProfileStatus, AccountStatus, User } from './types';
import { GoogleGenAI, Type } from "@google/genai";

// Supabase Imports
import { useSupabase } from './hooks/useSupabase';
import { projectApi, domainApi, bmApi, partnershipApi, profileApi, pageApi, integrationApi, userApi } from './api';

import { LoginView } from './components/layout/LoginView';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { UpdateLogoModal } from './components/modals/UpdateLogoModal';

import { DashboardView } from './components/views/DashboardView';
import { ProjectsView } from './components/views/ProjectsView';
import { DomainsView } from './components/views/DomainsView';
import { BMsView } from './components/views/BMsView';
import { ChatbotsView } from './components/views/ChatbotsView';
import { PartnershipsView } from './components/views/PartnershipsView';
import { ProfilesView } from './components/views/ProfilesView';
import { PagesView } from './components/views/PagesView';
import { ConfigurationView } from './components/views/ConfigurationView';

import { countryList } from './data/countries';
import { languageList } from './data/languages';

// Localization
const translations = {
    pt: {
        projects: "Projetos",
        domains: "Domínios",
        profiles: "Perfis",
        pages: "Páginas",
        bms: "BMs",
        adAccounts: "Contas de Anúncios",
        chatbots: "Chatbots",
        apps: "Aplicativos",
        history: "Histórico",
        list: "Lista",
        search: "Pesquisar tudo...",
        addProject: "Adicionar Projeto",
        editProject: "Editar Projeto",
        projectName: "Nome do Projeto",
        country: "País",
        countries: "Países",
        language: "Idioma",
        noProjects: "Nenhum projeto encontrado.",
        title: "MT Connect Digital - Hub de Projetos",
        welcome: "Bem-vindo ao Hub de Projetos",
        description: "Selecione uma categoria na barra lateral para começar.",
        save: "Salvar",
        cancel: "Cancelar",
        selectCountries: "Selecione os países",
        selectLanguage: "Selecione o idioma",
        actions: "Ações",
        searchCountries: "Pesquisar países...",
        searchLanguages: "Pesquisar idiomas...",
        addDomain: "Adicionar Domínio",
        editDomain: "Editar Domínio",
        domainName: "Nome do Domínio",
        subdomains: "Subdomínios",
        noDomains: "Nenhum domínio encontrado.",
        addSubdomain: "Adicionar Subdomínio",
        subdomainName: "Nome (ex: www)",
        gamAccount: "Conta GAM",
        gamCountry: "País da Conta GAM",
        partnership: "Parceria",
        planningSheetUrl: "URL da Planilha",
        publisherAdx: "Nome do ADX",
        preloader: "Pré-loader",
        offerwall: "Offerwall",
        pinReceived: "PIN Recebido",
        yes: "Sim",
        no: "Não",
        categories: "Categorias",
        addCategory: "Adicionar categoria...",
        delete: "Excluir",
        confirmDelete: "Confirmar Exclusão",
        areYouSureDelete: "Tem certeza que deseja excluir este domínio?",
        updateLogo: "Atualizar Logo",
        selectFile: "Selecionar arquivo",
        addBm: "Adicionar BM",
        editBm: "Editar BM",
        bmName: "Nome do BM",
        bmId: "ID do BM",
        noBms: "Nenhum BM encontrado.",
        accessVerification: "Verificação de Acesso",
        itProviderVerified: "Verificado como Provedor de TI",
        areYouSureDeleteBm: "Tem certeza que deseja excluir este BM?",
        activeDomains: "Dominios Ativos",
        inactiveItems: "Itens Inativos",
        inactiveDomains: "Domínios Principais Inativos",
        inactiveSubdomains: "Subdominios Inativos",
        withPin: "Com PIN",
        withoutPin: "Sem PIN",
        viewGrouped: "Visão Agrupada",
        viewByLanguage: "Visão por Idioma",
        date: "Data",
        entity: "Entidade",
        action: "Ação",
        details: "Detalhes",
        noHistory: "Nenhum histórico de atividades.",
        entityDomain: "Domínio",
        entitySubdomain: "Subdomínio",
        entityBM: "BM",
        actionCreate: "Criar",
        actionUpdate: "Atualizar",
        actionDelete: "Excluir",
        actionActivate: "Ativar",
        actionDeactivate: "Desativar",
        parentDomain: "Domínio Pai",
        addAdAccount: "Adicionar Conta de Anúncios",
        adAccountName: "Nome da Conta",
        accountId: "ID da Conta",
        paymentMethod: "Método de Pagamento",
        paymentMethodOwner: "Dono do Pagamento",
        noAdAccounts: "Nenhuma conta de anúncios encontrada.",
        configuration: "Configurações",
        logout: "Sair",
        username: "Usuário",
        password: "Senha",
        login: "Entrar",
        loginFailed: "Credenciais inválidas.",
        welcomeLogin: "Bem-vindo ao Hub de Projetos",
        loginDescription: "Faça login para continuar.",
        appName: "Nome do App",
        appId: "ID do App",
        addApp: "Adicionar App",
        noAdAccountsInBm: "Nenhuma conta de anúncios encontrada para este BM.",
        noAppsInBm: "Nenhum aplicativo encontrado para este BM.",
        partnerships: "Parcerias",
        addPartnership: "Adicionar Parceria",
        editPartnership: "Editar Parceria",
        partnershipName: "Nome da Parceria",
        acronym: "Sigla",
        discord: "Discord",
        whatsapp: "WhatsApp",
        notes: "Notas",
        noPartnerships: "Nenhuma parceria encontrada.",
        areYouSureDeletePartnership: "Tem certeza que deseja excluir esta parceria?",
        entityPartnership: "Parceria",
        appDomain: "Domínio do App",
        permissions: "Permissões",
        approvalStep: "Etapa de Aprovação",
        step: "Etapa",
        appLogin: "Login do App",
        appUrl: "URL do App",
        selectPartnership: "Selecione a parceria",
        searchPartnerships: "Pesquisar parcerias...",
        noChatbots: "Nenhum chatbot/app encontrado.",
        bmParent: "BM Pai",
        editApp: "Editar App",
        appCredentials: "Credenciales do App",
        step1_label: "Criação",
        step2_label: "Chamadas de API",
        step3_label: "Acesso a Permissões Avançadas",
        step4_label: "Aprovado",
        selectPartner: "Selecione um parceiro",
        searchPartners: "Pesquisar parceiros...",
        selectDomains: "Selecione domínios",
        searchDomains: "Pesquisar domínios...",
        selectProfiles: "Selecione perfis",
        searchProfiles: "Pesquisar perfis...",
        selectBms: "Selecione BMs",
        searchBms: "Pesquisar BMs...",
        selectPages: "Selecione páginas",
        searchPages: "Pesquisar páginas...",
        selectAdAccount: "Selecione uma conta de anúncios",
        searchAdAccounts: "Pesquisar contas de anúncios...",
        selectChatbot: "Selecione um chatbot",
        searchChatbots: "Pesquisar chatbots...",
        selectProjects: "Selecione projetos",
        searchProjects: "Pesquisar projetos...",
        category: "Categoria",
        selectCategory: "Selecione uma categoria",
        searchCategories: "Pesquisar categorias...",
        selectPartnerships: "Selecione parcerias",
        selectBm: "Selecione um BM",
        projectStatus: "Status do Projeto",
        selectProjectStatus: "Selecione um status",
        searchStatus: "Pesquisar status...",
        hasRunningCampaigns: "Possui campanhas ativas",
        analyst: "Analista",
        selectAnalyst: "Selecione um analista",
        searchAnalyst: "Pesquisar analista...",
        statusInProgress: "Em Progresso",
        statusPending: "Pendente",
        statusActive: "Ativo",
        statusDeactivated: "Desativado",
        statusPaused: "Pausado",
        statusBroad: "Broadcast",
        filters: "Filtros",
        clearFilters: "Limpar Filtros",
        minProfiles: "Mín. Perfis",
        minPages: "Mín. Páginas",
        apiKey: "Chave da API",
        apiKeyPlaceholder: "Insira sua chave da API do Google AI Studio...",
        getApiKey: "Obter Chave da API",
        aiDisabledWarning: "Recursos de IA desativados. Configure sua chave da API nas configurações.",

        // Profiles
        addProfile: "Adicionar Perfil",
        editProfile: "Editar Perfil",
        profileName: "Nome do Perfil",
        facebookId: "ID do Facebook",
        purchaseDate: "Data da Compra",
        supplier: "Fornecedor",
        price: "Preço",
        profileStatus: "Status do Perfil",
        profileRole: "Função",
        securityKey: "Chave de Segurança",
        email: "E-mail",
        accountStatus: "Status da Conta do Facebook",
        driveLink: "Link do Drive",
        noProfiles: "Nenhum perfil encontrado.",
        areYouSureDeleteProfile: "Tem certeza que deseja excluir este perfil?",
        entityProfile: "Perfil",
        statusWarmUp: "Aquecimento",
        statusStock: "Estoque",
        statusInUse: "Em Uso",
        statusInvalidated: "Invalidated",
        roleAdvertiser: "Anunciante",
        roleContingency: "Contingência",
        roleBot: "Bot",
        roleBackup: "Backup",
        accountStatusOK: "OK",
        accountStatusIssues: "Perfil com problemas",
        accountStatusRisk: "Perfil em risco",
        addEmail: "Adicionar e-mail...",
        selectProfileStatus: "Selecione o status",
        selectRole: "Selecione a função",
        selectSecurityKey: "Selecione as chaves",
        selectAccountStatus: "Selecione o status da conta",
        recoveryEmail: "E-mail de Recuperação",
        emailPassword: "Senha do E-mail",
        facebookPassword: "Senha do Facebook",
        twoFactorCode: "Código 2FA",
        addProfilesBulk: "Adicionar Perfis em Lote",
        addProfilesBulkDescription: "Revise os perfis extraídos dos arquivos ou selecione perfis existentes para editar. Utilize o painel de ações em massa para aplicar alterações a todos os itens listados.",
        parsingProfiles: "Lendo arquivos...",
        exportToAdsPower: "Exportar para AdsPower",
        selected: "Selecionados",
        selectAll: "Selecionar Todos",
        foundProfiles: "Perfis Encontrados",

        // Pages
        addPage: "Adicionar Página",
        editPage: "Editar Página",
        pageName: "Nome da Página",
        noPages: "Nenhuma página encontrada.",
        areYouSureDeletePage: "Tem certeza que deseja excluir esta página?",
        entityPage: "Página",
        pageIdExistsError: "Já existe uma página com este ID do Facebook.",
        addPagesBulk: "Adicionar Páginas em Lote",
        addPagesBulkDescription: "Edite os nomes transcritos e adicione o ID do Facebook para cada página.",
        bulkSaveError: "Alguns itens não puderam ser salvos. Por favor, revise os erros abaixo.",
        saveAll: "Salvar Todos",
        saving: "Salvando...",
        transcribing: "Transcrevendo imagem...",
        uploadImage: "Carregar Imagem",
        uploadOrPaste: "Carregar imagem ou colar da área de transferência (Ctrl+V)",
        extractPages: "Extrair Páginas",
        selectImage: "Selecionar Imagem",
        changeImage: "Alterar Imagem",
        noImageSelected: "Nenhuma imagem selecionada",
        importFromIntegration: "Importar da Integração",
        selectIntegration: "Selecione a Integração",
        connect: "Conectar",
        selectProject: "Selecione o Projeto",
        fetchProfiles: "Buscar Perfis",
        fetchPages: "Buscar Páginas",
        foundPages: "Páginas Encontradas",
        importSelected: "Importar Selecionadas",
        connecting: "Conectando...",
        fetching: "Buscando...",
        noProjectsFound: "Nenhum projeto encontrado.",
        noProfilesFound: "Nenhum perfil encontrado.",
        importSuccess: "Páginas importadas com sucesso!",
        deleteSelected: "Excluir Selecionados",
        confirmBulkDelete: "Confirmar Exclusão em Massa",
        areYouSureBulkDeletePages: "Tem certeza que deseja excluir as páginas selecionadas?",
        editSelected: "Editar Selecionados",

        // Integrations/Config
        integrations: "Integrações",
        addIntegration: "Adicionar Integração",
        editIntegration: "Editar Integração",
        integrationName: "Nome da Integração",
        baseUrl: "URL Base",
        loginUrl: "URL de Login",
        userId: "ID do Usuário",
        noIntegrations: "Nenhuma integração configurada.",
        areYouSureDeleteIntegration: "Tem certeza que deseja excluir esta integração?",
        entityIntegration: "Integração",

        // User Roles
        roleContent: "Conteúdo",
        roleSupport: "Suporte",
        roleStructure: "Estrutura",
        roleAnalyst: "Analista",
        roleTraffic: "Analista", // Legacy support, renamed to Analyst in UI
        roleCreatives: "Criativos",
        roleBroadcast: "Broadcast",
        roleDevelopment: "Desenvolvimento",
        roleManagement: "Gestão",
        roleOwner: "Dono",
        
        // User Role Descriptions
        descContent: "Cria conteúdo para páginas/domínios.",
        descSupport: "Suporte ao conteúdo, servidores, criação de domínios.",
        descStructure: "Gerencia perfis, páginas, e estrutura de novos projetos.",
        descAnalyst: "Gerencia anúncios, analisa projetos e tomadas de decisão.",
        descTraffic: "Gerencia anúncios, analisa projetos e tomadas de decisão.", // Legacy
        descCreatives: "Cria criativos para campanhas de tráfego.",
        descBroadcast: "Analisa e configura broadcasts de mensagens.",
        descDevelopment: "Constrói e mantém aplicações/dashboards.",
        descManagement: "Responsável por outras equipes.",
        descOwner: "Dono da empresa.",
    },
    en: {
        projects: "Projects",
        domains: "Domains",
        profiles: "Profiles",
        pages: "Pages",
        bms: "BMs",
        adAccounts: "Ad Accounts",
        chatbots: "Chatbots",
        apps: "Apps",
        history: "History",
        list: "List",
        search: "Search everything...",
        addProject: "Add Project",
        editProject: "Edit Project",
        projectName: "Project Name",
        country: "Country",
        countries: "Countries",
        language: "Language",
        noProjects: "No projects found.",
        title: "MT Connect Digital - Project Hub",
        welcome: "Welcome to the Project Hub",
        description: "Select a category from the sidebar to get started.",
        save: "Save",
        cancel: "Cancel",
        selectCountries: "Select countries",
        selectLanguage: "Select language",
        actions: "Actions",
        searchCountries: "Search countries...",
        searchLanguages: "Search languages...",
        addDomain: "Add Domain",
        editDomain: "Edit Domain",
        domainName: "Domain Name",
        subdomains: "Subdomains",
        noDomains: "No domains found.",
        addSubdomain: "Add Subdomain",
        subdomainName: "Name (e.g., www)",
        gamAccount: "GAM Account",
        gamCountry: "GAM Country",
        partnership: "Partnership",
        planningSheetUrl: "Planning Sheet URL",
        publisherAdx: "Publisher ADX",
        preloader: "Preloader",
        offerwall: "Offerwall",
        pinReceived: "PIN Received",
        yes: "Yes",
        no: "No",
        categories: "Categories",
        addCategory: "Add category...",
        delete: "Delete",
        confirmDelete: "Confirm Delete",
        areYouSureDelete: "Are you sure you want to delete this domain?",
        updateLogo: "Update Logo",
        selectFile: "Select file",
        addBm: "Add BM",
        editBm: "Edit BM",
        bmName: "BM Name",
        bmId: "BM ID",
        noBms: "No BMs found.",
        accessVerification: "Access Verification",
        itProviderVerified: "IT Provider Verified",
        areYouSureDeleteBm: "Are you sure you want to delete this BM?",
        activeDomains: "Active Domains",
        inactiveItems: "Inactive Items",
        inactiveDomains: "Inactive Main Domains",
        inactiveSubdomains: "Inactive Subdomains",
        withPin: "With PIN",
        withoutPin: "Without PIN",
        viewGrouped: "Grouped View",
        viewByLanguage: "Language View",
        date: "Date",
        entity: "Entity",
        action: "Action",
        details: "Details",
        noHistory: "No activity history.",
        entityDomain: "Domain",
        entitySubdomain: "Subdomain",
        entityBM: "BM",
        actionCreate: "Create",
        actionUpdate: "Update",
        actionDelete: "Delete",
        actionActivate: "Activate",
        actionDeactivate: "Deactivate",
        parentDomain: "Parent Domain",
        addAdAccount: "Add Ad Account",
        adAccountName: "Account Name",
        accountId: "Account ID",
        paymentMethod: "Payment Method",
        paymentMethodOwner: "Payment Owner",
        noAdAccounts: "No ad accounts found.",
        configuration: "Configuration",
        logout: "Logout",
        username: "Username",
        password: "Password",
        login: "Login",
        loginFailed: "Invalid credentials.",
        welcomeLogin: "Welcome to Project Hub",
        loginDescription: "Please login to continue.",
        appName: "App Name",
        appId: "App ID",
        addApp: "Add App",
        noAdAccountsInBm: "No ad accounts found for this BM.",
        noAppsInBm: "No apps found for this BM.",
        partnerships: "Partnerships",
        addPartnership: "Add Partnership",
        editPartnership: "Edit Partnership",
        partnershipName: "Partnership Name",
        acronym: "Acronym",
        discord: "Discord",
        whatsapp: "WhatsApp",
        notes: "Notes",
        noPartnerships: "No partnerships found.",
        areYouSureDeletePartnership: "Are you sure you want to delete this partnership?",
        entityPartnership: "Partnership",
        appDomain: "App Domain",
        permissions: "Permissions",
        approvalStep: "Approval Step",
        step: "Step",
        appLogin: "App Login",
        appUrl: "App URL",
        selectPartnership: "Select partnership",
        searchPartnerships: "Search partnerships...",
        noChatbots: "No chatbots/apps found.",
        bmParent: "Parent BM",
        editApp: "Edit App",
        appCredentials: "App Credentials",
        step1_label: "Creation",
        step2_label: "API Calls",
        step3_label: "Advanced Permissions Access",
        step4_label: "Approved",
        selectPartner: "Select a partner",
        searchPartners: "Search partners...",
        selectDomains: "Select domains",
        searchDomains: "Search domains...",
        selectProfiles: "Select profiles",
        searchProfiles: "Search profiles...",
        selectBms: "Select BMs",
        searchBms: "Search BMs...",
        selectPages: "Select pages",
        searchPages: "Search pages...",
        selectAdAccount: "Select an ad account",
        searchAdAccounts: "Search ad accounts...",
        selectChatbot: "Select a chatbot",
        searchChatbots: "Search chatbots...",
        selectProjects: "Select projects",
        searchProjects: "Search projects...",
        category: "Category",
        selectCategory: "Select a category",
        searchCategories: "Search categories...",
        selectPartnerships: "Select partnerships",
        selectBm: "Select a BM",
        projectStatus: "Project Status",
        selectProjectStatus: "Select a status",
        searchStatus: "Search status...",
        hasRunningCampaigns: "Has active campaigns",
        analyst: "Analyst",
        selectAnalyst: "Select an analyst",
        searchAnalyst: "Search analyst...",
        statusInProgress: "In Progress",
        statusPending: "Pending",
        statusActive: "Active",
        statusDeactivated: "Deactivated",
        statusPaused: "Paused",
        statusBroad: "Broadcast",
        filters: "Filters",
        clearFilters: "Clear Filters",
        minProfiles: "Min Profiles",
        minPages: "Min Pages",
        apiKey: "API Key",
        apiKeyPlaceholder: "Enter your Google AI Studio API Key...",
        getApiKey: "Get API Key",
        aiDisabledWarning: "AI features disabled. Configure your API key in settings.",

        // Profiles
        addProfile: "Add Profile",
        editProfile: "Edit Profile",
        profileName: "Profile Name",
        facebookId: "Facebook ID",
        purchaseDate: "Purchase Date",
        supplier: "Supplier",
        price: "Price",
        profileStatus: "Profile Status",
        profileRole: "Role",
        securityKey: "Security Key",
        email: "Email",
        accountStatus: "Account Status",
        driveLink: "Drive Link",
        noProfiles: "No profiles found.",
        areYouSureDeleteProfile: "Are you sure you want to delete this profile?",
        entityProfile: "Profile",
        statusWarmUp: "Warm Up",
        statusStock: "Stock",
        statusInUse: "In Use",
        statusInvalidated: "Invalidated",
        roleAdvertiser: "Advertiser",
        roleContingency: "Contingency",
        roleBot: "Bot",
        roleBackup: "Backup",
        accountStatusOK: "OK",
        accountStatusIssues: "Profile has issues",
        accountStatusRisk: "Profile is at risk",
        addEmail: "Add email...",
        selectProfileStatus: "Select status",
        selectRole: "Select role",
        selectSecurityKey: "Select keys",
        selectAccountStatus: "Select account status",
        recoveryEmail: "Recovery Email",
        emailPassword: "Email Password",
        facebookPassword: "Facebook Password",
        twoFactorCode: "2FA Code",
        addProfilesBulk: "Add Profiles Bulk",
        addProfilesBulkDescription: "Review profiles extracted from files or select existing profiles to edit. Use the bulk action panel to apply changes to all listed items.",
        parsingProfiles: "Reading files...",
        exportToAdsPower: "Export to AdsPower",
        selected: "Selected",
        selectAll: "Select All",
        foundProfiles: "Profiles Found",

        // Pages
        addPage: "Add Page",
        editPage: "Edit Page",
        pageName: "Page Name",
        noPages: "No pages found.",
        areYouSureDeletePage: "Are you sure you want to delete this page?",
        entityPage: "Page",
        pageIdExistsError: "A page with this Facebook ID already exists.",
        addPagesBulk: "Add Pages Bulk",
        addPagesBulkDescription: "Edit transcribed names and add Facebook ID for each page.",
        bulkSaveError: "Some items could not be saved. Please review the errors below.",
        saveAll: "Save All",
        saving: "Saving...",
        transcribing: "Transcribing image...",
        uploadImage: "Upload Image",
        uploadOrPaste: "Upload image or paste from clipboard (Ctrl+V)",
        extractPages: "Extract Pages",
        selectImage: "Select Image",
        changeImage: "Change Image",
        noImageSelected: "No image selected",
        importFromIntegration: "Import from Integration",
        selectIntegration: "Select Integration",
        connect: "Connect",
        selectProject: "Select Project",
        fetchProfiles: "Fetch Profiles",
        fetchPages: "Fetch Pages",
        foundPages: "Pages Found",
        importSelected: "Import Selected",
        connecting: "Connecting...",
        fetching: "Fetching...",
        noProjectsFound: "No projects found.",
        noProfilesFound: "No profiles found.",
        importSuccess: "Pages imported successfully!",
        deleteSelected: "Delete Selected",
        confirmBulkDelete: "Confirm Bulk Delete",
        areYouSureBulkDeletePages: "Are you sure you want to delete the selected pages?",
        editSelected: "Edit Selected",

        // Integrations/Config
        integrations: "Integrations",
        addIntegration: "Add Integration",
        editIntegration: "Edit Integration",
        integrationName: "Integration Name",
        baseUrl: "Base URL",
        loginUrl: "Login URL",
        userId: "User ID",
        noIntegrations: "No integrations configured.",
        areYouSureDeleteIntegration: "Are you sure you want to delete this integration?",
        entityIntegration: "Integration",

        // User Roles
        roleContent: "Content",
        roleSupport: "Support",
        roleStructure: "Structure",
        roleAnalyst: "Analyst",
        roleTraffic: "Analyst",
        roleCreatives: "Creatives",
        roleBroadcast: "Broadcast",
        roleDevelopment: "Development",
        roleManagement: "Management",
        roleOwner: "Owner",

        // User Role Descriptions
        descContent: "Creates content for pages/domains.",
        descSupport: "Content support, servers, domain creation.",
        descStructure: "Manages profiles, pages, and new project structure.",
        descAnalyst: "Manages ads, analyzes projects and decision making.",
        descTraffic: "Manages ads, analyzes projects and decision making.",
        descCreatives: "Creates creatives for traffic campaigns.",
        descBroadcast: "Analyzes and configures message broadcasts.",
        descDevelopment: "Builds and maintains apps/dashboards.",
        descManagement: "Responsible for other teams.",
        descOwner: "Company owner.",
    },
    es: {
        projects: "Proyectos",
        domains: "Dominios",
        profiles: "Perfiles",
        pages: "Páginas",
        bms: "BMs",
        adAccounts: "Cuentas Publicitarias",
        chatbots: "Chatbots",
        apps: "Aplicaciones",
        history: "Historial",
        list: "Lista",
        search: "Buscar todo...",
        addProject: "Agregar Proyecto",
        editProject: "Editar Proyecto",
        projectName: "Nombre del Proyecto",
        country: "País",
        countries: "Países",
        language: "Idioma",
        noProjects: "No se encontraron proyectos.",
        title: "MT Connect Digital - Hub de Proyectos",
        welcome: "Bienvenido al Hub de Proyectos",
        description: "Seleccione una categoría de la barra lateral para comenzar.",
        save: "Guardar",
        cancel: "Cancelar",
        selectCountries: "Seleccionar países",
        selectLanguage: "Seleccionar idioma",
        actions: "Acciones",
        searchCountries: "Buscar países...",
        searchLanguages: "Buscar idiomas...",
        addDomain: "Agregar Dominio",
        editDomain: "Editar Dominio",
        domainName: "Nombre del Dominio",
        subdomains: "Subdominios",
        noDomains: "No se encontraron dominios.",
        addSubdomain: "Agregar Subdominio",
        subdomainName: "Nombre (ej: www)",
        gamAccount: "Cuenta GAM",
        gamCountry: "País GAM",
        partnership: "Alianza",
        planningSheetUrl: "URL Hoja de Planificación",
        publisherAdx: "Editor ADX",
        preloader: "Precargador",
        offerwall: "Offerwall",
        pinReceived: "PIN Recibido",
        yes: "Sí",
        no: "No",
        categories: "Categorías",
        addCategory: "Agregar categoría...",
        delete: "Eliminar",
        confirmDelete: "Confirmar Eliminación",
        areYouSureDelete: "¿Estás seguro de que deseas eliminar este dominio?",
        updateLogo: "Actualizar Logo",
        selectFile: "Seleccionar archivo",
        addBm: "Agregar BM",
        editBm: "Editar BM",
        bmName: "Nombre del BM",
        bmId: "ID del BM",
        noBms: "No se encontraron BMs.",
        accessVerification: "Verificación de Acceso",
        itProviderVerified: "Proveedor TI Verificado",
        areYouSureDeleteBm: "¿Estás seguro de que deseas eliminar este BM?",
        activeDomains: "Dominios Activos",
        inactiveItems: "Ítems Inactivos",
        inactiveDomains: "Dominios Principales Inactivos",
        inactiveSubdomains: "Subdominios Inactivos",
        withPin: "Con PIN",
        withoutPin: "Sin PIN",
        viewGrouped: "Vista Agrupada",
        viewByLanguage: "Vista por Idioma",
        date: "Fecha",
        entity: "Entidad",
        action: "Acción",
        details: "Detalles",
        noHistory: "No hay historial de actividad.",
        entityDomain: "Dominio",
        entitySubdomain: "Subdominio",
        entityBM: "BM",
        actionCreate: "Crear",
        actionUpdate: "Actualizar",
        actionDelete: "Eliminar",
        actionActivate: "Activar",
        actionDeactivate: "Desactivar",
        parentDomain: "Dominio Padre",
        addAdAccount: "Agregar Cuenta Publicitaria",
        adAccountName: "Nombre de Cuenta",
        accountId: "ID de Cuenta",
        paymentMethod: "Método de Pago",
        paymentMethodOwner: "Propietario del Pago",
        noAdAccounts: "No se encontraron cuentas publicitarias.",
        configuration: "Configuración",
        logout: "Cerrar Sesión",
        username: "Usuario",
        password: "Contraseña",
        login: "Ingresar",
        loginFailed: "Credenciales inválidas.",
        welcomeLogin: "Bienvenido al Hub de Proyectos",
        loginDescription: "Inicie sesión para continuar.",
        appName: "Nombre App",
        appId: "ID App",
        addApp: "Agregar App",
        noAdAccountsInBm: "No se encontraron cuentas publicitarias en este BM.",
        noAppsInBm: "No se encontraron apps en este BM.",
        partnerships: "Alianzas",
        addPartnership: "Agregar Alianza",
        editPartnership: "Editar Alianza",
        partnershipName: "Nombre de Alianza",
        acronym: "Siglas",
        discord: "Discord",
        whatsapp: "WhatsApp",
        notes: "Notas",
        noPartnerships: "No se encontraron alianzas.",
        areYouSureDeletePartnership: "¿Estás seguro de que deseas eliminar esta alianza?",
        entityPartnership: "Alianza",
        appDomain: "Dominio App",
        permissions: "Permisos",
        approvalStep: "Paso de Aprobación",
        step: "Paso",
        appLogin: "Login App",
        appUrl: "URL App",
        selectPartnership: "Seleccionar alianza",
        searchPartnerships: "Buscar alianzas...",
        noChatbots: "No se encontraron chatbots/apps.",
        bmParent: "BM Padre",
        editApp: "Editar App",
        appCredentials: "Credenciales App",
        step1_label: "Creación",
        step2_label: "Llamadas API",
        step3_label: "Acceso Permisos Avanzados",
        step4_label: "Aprobado",
        selectPartner: "Seleccionar socio",
        searchPartners: "Buscar socios...",
        selectDomains: "Seleccionar dominios",
        searchDomains: "Buscar dominios...",
        selectProfiles: "Seleccionar perfiles",
        searchProfiles: "Buscar perfiles...",
        selectBms: "Seleccionar BMs",
        searchBms: "Buscar BMs...",
        selectPages: "Seleccionar páginas",
        searchPages: "Buscar páginas...",
        selectAdAccount: "Seleccionar cuenta pub.",
        searchAdAccounts: "Buscar cuentas pub...",
        selectChatbot: "Seleccionar chatbot",
        searchChatbots: "Buscar chatbots...",
        selectProjects: "Seleccionar proyectos",
        searchProjects: "Buscar proyectos...",
        category: "Categoría",
        selectCategory: "Seleccionar categoría",
        searchCategories: "Buscar categorías...",
        selectPartnerships: "Seleccionar alianzas",
        selectBm: "Seleccionar BM",
        projectStatus: "Estado del Proyecto",
        selectProjectStatus: "Seleccionar estado",
        searchStatus: "Buscar estado...",
        hasRunningCampaigns: "Tiene campañas activas",
        analyst: "Analista",
        selectAnalyst: "Seleccionar analista",
        searchAnalyst: "Buscar analista...",
        statusInProgress: "En Progreso",
        statusPending: "Pendiente",
        statusActive: "Activo",
        statusDeactivated: "Desactivado",
        statusPaused: "Pausado",
        statusBroad: "Broadcast",
        filters: "Filtros",
        clearFilters: "Limpiar Filtros",
        minProfiles: "Min Perfiles",
        minPages: "Min Páginas",
        apiKey: "Clave API",
        apiKeyPlaceholder: "Ingrese su Clave API de Google AI Studio...",
        getApiKey: "Obtener Clave API",
        aiDisabledWarning: "Funciones de IA desactivadas. Configure su clave API en ajustes.",

        // Profiles
        addProfile: "Agregar Perfil",
        editProfile: "Editar Perfil",
        profileName: "Nombre Perfil",
        facebookId: "ID Facebook",
        purchaseDate: "Fecha Compra",
        supplier: "Proveedor",
        price: "Precio",
        profileStatus: "Estado Perfil",
        profileRole: "Rol",
        securityKey: "Clave Seguridad",
        email: "Correo",
        accountStatus: "Estado Cuenta",
        driveLink: "Link Drive",
        noProfiles: "No se encontraron perfiles.",
        areYouSureDeleteProfile: "¿Estás seguro de que deseas eliminar este perfil?",
        entityProfile: "Perfil",
        statusWarmUp: "Calentamiento",
        statusStock: "Stock",
        statusInUse: "En Uso",
        statusInvalidated: "Invalidado",
        roleAdvertiser: "Anunciante",
        roleContingency: "Contingencia",
        roleBot: "Bot",
        roleBackup: "Backup",
        accountStatusOK: "OK",
        accountStatusIssues: "Perfil con problemas",
        accountStatusRisk: "Perfil en riesgo",
        addEmail: "Agregar correo...",
        selectProfileStatus: "Seleccionar estado",
        selectRole: "Seleccionar rol",
        selectSecurityKey: "Seleccionar claves",
        selectAccountStatus: "Seleccionar estado cuenta",
        recoveryEmail: "Correo Recuperación",
        emailPassword: "Clave Correo",
        facebookPassword: "Clave Facebook",
        twoFactorCode: "Código 2FA",
        addProfilesBulk: "Agregar Perfiles en Lote",
        addProfilesBulkDescription: "Revise los perfiles extraídos o edite existentes. Use el panel masivo para aplicar cambios.",
        parsingProfiles: "Leyendo archivos...",
        exportToAdsPower: "Exportar a AdsPower",
        selected: "Seleccionados",
        selectAll: "Seleccionar Todo",
        foundProfiles: "Perfiles Encontrados",

        // Pages
        addPage: "Agregar Página",
        editPage: "Editar Página",
        pageName: "Nombre Página",
        noPages: "No se encontraron páginas.",
        areYouSureDeletePage: "¿Estás seguro de que deseas eliminar esta página?",
        entityPage: "Página",
        pageIdExistsError: "Ya existe una página con este ID de Facebook.",
        addPagesBulk: "Agregar Páginas en Lote",
        addPagesBulkDescription: "Edite nombres transcritos y agregue ID de Facebook.",
        bulkSaveError: "Algunos ítems no se pudieron guardar. Revise los errores.",
        saveAll: "Guardar Todo",
        saving: "Guardando...",
        transcribing: "Transcribiendo imagen...",
        uploadImage: "Subir Imagen",
        uploadOrPaste: "Subir imagen o pegar (Ctrl+V)",
        extractPages: "Extraer Páginas",
        selectImage: "Seleccionar Imagen",
        changeImage: "Cambiar Imagen",
        noImageSelected: "Ninguna imagen seleccionada",
        importFromIntegration: "Importar de Integración",
        selectIntegration: "Seleccionar Integración",
        connect: "Conectar",
        selectProject: "Seleccionar Proyecto",
        fetchProfiles: "Buscar Perfiles",
        fetchPages: "Buscar Páginas",
        foundPages: "Páginas Encontradas",
        importSelected: "Importar Seleccionadas",
        connecting: "Conectando...",
        fetching: "Buscando...",
        noProjectsFound: "No se encontraron proyectos.",
        noProfilesFound: "No se encontraron perfiles.",
        importSuccess: "¡Páginas importadas con éxito!",
        deleteSelected: "Eliminar Seleccionados",
        confirmBulkDelete: "Confirmar Eliminación Masiva",
        areYouSureBulkDeletePages: "¿Seguro que desea eliminar las páginas seleccionadas?",
        editSelected: "Editar Seleccionados",

        // Integrations/Config
        integrations: "Integraciones",
        addIntegration: "Agregar Integración",
        editIntegration: "Editar Integración",
        integrationName: "Nombre Integración",
        baseUrl: "URL Base",
        loginUrl: "URL Login",
        userId: "ID Usuario",
        noIntegrations: "No hay integraciones configuradas.",
        areYouSureDeleteIntegration: "¿Seguro que desea eliminar esta integración?",
        entityIntegration: "Integración",

        // User Roles
        roleContent: "Contenido",
        roleSupport: "Soporte",
        roleStructure: "Estructura",
        roleAnalyst: "Analista",
        roleTraffic: "Analista",
        roleCreatives: "Creativos",
        roleBroadcast: "Broadcast",
        roleDevelopment: "Desarrollo",
        roleManagement: "Gestión",
        roleOwner: "Dueño",

        // User Role Descriptions
        descContent: "Crea contenido para páginas/dominios.",
        descSupport: "Soporte de contenido, servidores, dominios.",
        descStructure: "Gestiona perfiles, páginas y estructura de proyectos.",
        descAnalyst: "Gestiona anuncios, analiza proyectos y toma decisiones.",
        descTraffic: "Gestiona anuncios, analiza proyectos y toma decisiones.",
        descCreatives: "Crea creativos para campañas de tráfico.",
        descBroadcast: "Analiza y configura broadcasts.",
        descDevelopment: "Construye y mantiene apps/dashboards.",
        descManagement: "Responsable por otros equipos.",
        descOwner: "Dueño de la empresa.",
    },
};

export const App = () => {
    const [user, setUser] = useState<User | null>(null);
    const [view, setView] = useState<View>('dashboard');
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');
    const [language, setLanguage] = useState<'pt' | 'en' | 'es'>('en');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [logoSrc, setLogoSrc] = useState<string | null>(null);
    const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
    
    // API Key state (kept for compatibility with ConfigurationView prop, but process.env.API_KEY is preferred for GenAI)
    const [userApiKey, setUserApiKey] = useState('');

    const [loginError, setLoginError] = useState('');

    const projects = useSupabase<Project>('projects');
    const domains = useSupabase<Domain>('domains');
    const bms = useSupabase<BM>('bms');
    const partnerships = useSupabase<Partnership>('partnerships');
    const profiles = useSupabase<Profile>('profiles');
    const pages = useSupabase<Page>('pages');
    const integrations = useSupabase<Integration>('integrations');
    const users = useSupabase<User>('users');

    const [domainViewMode, setDomainViewMode] = useState<DomainViewMode>('grouped');
    const [bmDetailViewType, setBmDetailViewType] = useState<'adAccounts' | 'apps'>('adAccounts');

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const handleLogin = async (u: string, p: string) => {
        const user = await userApi.login(u, p);
        if (user) {
            setUser(user);
            setLoginError('');
        } else {
            setLoginError('Invalid credentials');
        }
    };

    const handleRegister = async (u: Omit<User, 'id'>) => {
        await userApi.register(u);
    };
    
    const handleLogout = () => {
        setUser(null);
        setView('dashboard');
    };

    // GenAI: Parse Profiles
    const onParseProfiles = async (files: File[]): Promise<Partial<Profile>[]> => {
        if (!process.env.API_KEY) {
            console.error("API Key not configured in environment");
            throw new Error("API Key not configured");
        }
        
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const results: Partial<Profile>[] = [];

        for (const file of files) {
            const text = await file.text();
            const prompt = `Extract Facebook profiles from this text. Return a JSON array of objects with fields: name, facebookId, facebookPassword, twoFactorCode, email (string), emailPassword, recoveryEmail, supplier, price, status, role, driveLink, securityKeys (array of strings). \n\nText:\n${text}`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { 
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                facebookId: { type: Type.STRING },
                                facebookPassword: { type: Type.STRING },
                                twoFactorCode: { type: Type.STRING },
                                email: { type: Type.STRING },
                                emailPassword: { type: Type.STRING },
                                recoveryEmail: { type: Type.STRING },
                                supplier: { type: Type.STRING },
                                price: { type: Type.NUMBER },
                                status: { type: Type.STRING },
                                role: { type: Type.STRING },
                                driveLink: { type: Type.STRING },
                                securityKeys: { type: Type.ARRAY, items: { type: Type.STRING } },
                            }
                        }
                    }
                }
            });
            
            try {
                const json = JSON.parse(response.text);
                if (Array.isArray(json)) results.push(...json);
            } catch (e) { console.error(e); }
        }
        return results;
    };

    // GenAI: Transcribe Image for Pages
    const onTranscribeImage = async (base64: string): Promise<string[]> => {
        if (!process.env.API_KEY) {
             console.error("API Key not configured in environment");
             throw new Error("API Key not configured");
        }
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const prompt = "Extract all text lines from this image that look like page names. Return a JSON array of strings.";
        
        const base64Data = base64.split(',')[1];
        const mimeType = base64.split(';')[0].split(':')[1];

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    { inlineData: { mimeType, data: base64Data } },
                    { text: prompt }
                ]
            },
            config: { 
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                }
            }
        });
        
         try {
            const json = JSON.parse(response.text);
            return Array.isArray(json) ? json : [];
        } catch (e) { console.error(e); return []; }
    };

    if (!user) {
        return <LoginView onLogin={handleLogin} onRegister={handleRegister} t={translations[language]} error={loginError} />;
    }

    const t = translations[language];

    const renderView = () => {
        switch (view) {
            case 'dashboard': return <DashboardView t={t} />;
            case 'projects': return <ProjectsView t={t} projects={projects} onSaveProject={projectApi.save} getCountryName={(c) => c} getLanguageName={(l) => l} countryOptions={countryList.map(c => ({ value: c.en, label: c[language] }))} languageOptions={languageList.map(l => ({ value: l.en, label: l[language] }))} domains={domains} bms={bms} partnerships={partnerships} profiles={profiles} pages={pages} users={users} />;
            case 'domains': return <DomainsView t={t} domains={domains} partnerships={partnerships} projects={projects} onSaveDomain={domainApi.save} onDeleteDomain={domainApi.delete} onToggleDomainActive={(id, a) => domainApi.toggleActive(id, a, domains.find(d => d.id === id)?.name || '')} onToggleSubdomainActive={(did, sid, a) => { 
                const domain = domains.find(d => d.id === did);
                if (domain) {
                    const newSubdomains = domain.subdomains.map(s => s.id === sid ? { ...s, isActive: a } : s);
                    const subName = domain.subdomains.find(s => s.id === sid)?.name || 'Unknown';
                    domainApi.updateSubdomains(did, newSubdomains, domain.name, { name: subName, action: a ? 'Activate' : 'Deactivate' });
                }
            }} getCountryName={(c) => c} getLanguageName={(l) => l} countryOptions={countryList.map(c => ({ value: c.en, label: c[language] }))} languageOptions={languageList.map(l => ({ value: l.en, label: l[language] }))} projectOptions={projects.map(p => ({ value: p.id, label: p.name }))} viewMode={domainViewMode} setViewMode={setDomainViewMode} />;
            case 'profiles': return <ProfilesView t={t} profiles={profiles} pages={pages} integrations={integrations} onSaveProfile={profileApi.save} onDeleteProfile={profileApi.delete} onParseProfiles={onParseProfiles} onBulkSaveProfiles={async (p) => { await profileApi.bulkUpsert(p); return { success: true, errors: [] }; }} hasApiKey={!!process.env.API_KEY} />;
            case 'pages': return <PagesView t={t} pages={pages} profiles={profiles} integrations={integrations} onSavePage={pageApi.save} onDeletePage={pageApi.delete} onTranscribeImage={onTranscribeImage} onBulkSavePages={async (p) => { await pageApi.bulkUpsert(p); return { success: true, errors: [] }; }} onBulkDeletePages={pageApi.bulkDelete} hasApiKey={!!process.env.API_KEY} />;
            case 'bms': return <BMsView t={t} bms={bms} partnerships={partnerships} onSaveBm={bmApi.save} onDeleteBm={bmApi.delete} getCountryName={(c) => c} countryOptions={countryList.map(c => ({ value: c.en, label: c[language] }))} detailViewType={bmDetailViewType} setDetailViewType={setBmDetailViewType} partnershipOptions={partnerships.map(p => ({ value: p.id, label: p.name }))} projectOptions={projects.map(p => ({ value: p.id, label: p.name }))} profileOptions={profiles.map(p => ({ value: p.id, label: p.name }))} pageOptions={pages.map(p => ({ value: p.id, label: p.name }))} />;
            case 'chatbots': return <ChatbotsView t={t} bms={bms} partnerships={partnerships} onSaveApp={(app) => { 
                const bm = bms.find(b => b.apps.some(a => a.id === app.id)); 
                if (bm) { 
                    const newApps = bm.apps.map(a => a.id === app.id ? app : a); 
                    bmApi.updateApps(bm.id, newApps, bm.name, { appName: app.name, action: 'Update' }); 
                } 
            }} />;
            case 'partnerships': return <PartnershipsView t={t} partnerships={partnerships} onSavePartnership={partnershipApi.save} onDeletePartnership={partnershipApi.delete} projectOptions={projects.map(p => ({ value: p.id, label: p.name }))} profileOptions={profiles.map(p => ({ value: p.id, label: p.name }))} bmOptions={bms.map(b => ({ value: b.id, label: b.name }))} />;
            case 'configuration': return <ConfigurationView t={t} integrations={integrations} onSaveIntegration={integrationApi.save} onDeleteIntegration={integrationApi.delete} user={user} userApiKey={userApiKey} onApiKeyChange={setUserApiKey} />;
            default: return null;
        }
    };

    return (
        <div className={`flex h-screen bg-latte-base dark:bg-mocha-base ${theme}`}>
            <Sidebar t={t} view={view} setView={setView} isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} logoSrc={logoSrc} onLogoClick={() => setIsLogoModalOpen(true)} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header t={t} language={language} onLanguageChange={setLanguage} theme={theme} onThemeToggle={() => setTheme(theme === 'light' ? 'dark' : 'light')} onLogout={handleLogout} onSettingsClick={() => setView('configuration')} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                    {renderView()}
                </main>
            </div>
            <UpdateLogoModal isOpen={isLogoModalOpen} onClose={() => setIsLogoModalOpen(false)} onSave={(src) => { setLogoSrc(src); setIsLogoModalOpen(false); }} t={t} />
        </div>
    );
};
