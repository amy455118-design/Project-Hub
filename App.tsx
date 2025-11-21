
import React, { useState, useEffect, useCallback } from 'react';
import { Project, Domain, BM, Partnership, App as AppData, Profile, Page, View, DomainViewMode, ProfileRole, Integration, ProfileStatus, AccountStatus } from './types';
import { GoogleGenAI } from "@google/genai";

// Supabase Imports
import { useSupabase } from './hooks/useSupabase';
import { projectApi, domainApi, bmApi, partnershipApi, profileApi, pageApi, integrationApi } from './api';

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
        loginFailed: "Credenciales inválidas.",
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
        appCredentials: "Credenciais do App",
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
        addProfilesBulkDescription: "Revise os perfis extraídos dos arquivos e edite as informações conforme necessário.",
        parsingProfiles: "Lendo arquivos...",
        exportToAdsPower: "Exportar para AdsPower",
        selected: "Selecionados",
        selectAll: "Selecionar Todos",

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
        gamCountry: "GAM Account Country",
        partnership: "Partnership",
        planningSheetUrl: "Sheet URL",
        publisherAdx: "ADX Name",
        preloader: "Pre-loader",
        offerwall: "Offerwall",
        pinReceived: "PIN Received",
        yes: "Yes",
        no: "No",
        categories: "Categories",
        addCategory: "Add a category...",
        delete: "Delete",
        confirmDelete: "Confirm Deletion",
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
        inactiveDomains: "Inactive Parent Domains",
        inactiveSubdomains: "Inactive Subdomains",
        withPin: "With PIN",
        withoutPin: "Without PIN",
        viewGrouped: "Grouped View",
        viewByLanguage: "View by Language",
        date: "Date",
        entity: "Entity",
        action: "Action",
        details: "Details",
        noHistory: "No activity history found.",
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
        configuration: "Settings",
        logout: "Logout",
        username: "Username",
        password: "Password",
        login: "Login",
        loginFailed: "Invalid credentials.",
        welcomeLogin: "Welcome to the Project Hub",
        loginDescription: "Please log in to continue.",
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
        step3_label: "Advanced Permission Access",
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
        selectAdAccount: "Select an Ad Account",
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
        hasRunningCampaigns: "Has running campaigns",
        analyst: "Analyst",
        selectAnalyst: "Select an analyst",
        searchAnalyst: "Search analyst...",
        statusInProgress: "In Progress",
        statusPending: "Pending",
        statusActive: "Active",
        statusDeactivated: "Deactivated",
        statusPaused: "Paused",
        statusBroad: "Broad",
        
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
        email: "E-mail",
        accountStatus: "Facebook Account Status",
        driveLink: "Drive Link",
        noProfiles: "No profiles found.",
        areYouSureDeleteProfile: "Are you sure you want to delete this profile?",
        entityProfile: "Profile",
        statusWarmUp: "Warm up",
        statusStock: "Stock",
        statusInUse: "In Use",
        statusInvalidated: "Invalidated",
        roleAdvertiser: "Advertiser",
        roleContingency: "Contingency",
        roleBot: "Bot",
        roleBackup: "Backup",
        accountStatusOK: "OK",
        accountStatusIssues: "Profile has issues",
        accountStatusRisk: "Profile at risk",
        addEmail: "Add e-mail...",
        selectProfileStatus: "Select status",
        selectRole: "Select role",
        selectSecurityKey: "Select keys",
        selectAccountStatus: "Select account status",
        recoveryEmail: "Recovery Email",
        emailPassword: "Email Password",
        facebookPassword: "Facebook Password",
        twoFactorCode: "2FA Code",
        addProfilesBulk: "Add Profiles in Bulk",
        addProfilesBulkDescription: "Review the profiles extracted from the files and edit the information as needed.",
        parsingProfiles: "Reading files...",
        exportToAdsPower: "Export to AdsPower",
        selected: "Selected",
        selectAll: "Select All",

        // Pages
        addPage: "Add Page",
        editPage: "Edit Page",
        pageName: "Page Name",
        noPages: "No pages found.",
        areYouSureDeletePage: "Are you sure you want to delete this page?",
        entityPage: "Page",
        pageIdExistsError: "A page with this Facebook ID already exists.",
        addPagesBulk: "Add Pages in Bulk",
        addPagesBulkDescription: "Edit the transcribed names and add the Facebook ID for each page.",
        bulkSaveError: "Some items could not be saved. Please review the errors below.",
        saveAll: "Save All",
        saving: "Saving...",
        transcribing: "Transcribing image...",
        uploadImage: "Upload Image",
        uploadOrPaste: "Upload an image or paste from clipboard (Ctrl+V)",
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
        foundPages: "Found Pages",
        importSelected: "Import Selected",
        connecting: "Connecting...",
        fetching: "Fetching...",
        noProjectsFound: "No projects found.",
        noProfilesFound: "No profiles found.",
        importSuccess: "Pages imported successfully!",

        // Integrations
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
        addProject: "Añadir Proyecto",
        editProject: "Editar Proyecto",
        projectName: "Nombre del Proyecto",
        country: "País",
        countries: "Países",
        language: "Idioma",
        noProjects: "No se encontraron proyectos.",
        title: "MT Connect Digital - Centro de Proyectos",
        welcome: "Bienvenido al Centro de Proyectos",
        description: "Seleccione una categoría de la barra lateral para comenzar.",
        save: "Guardar",
        cancel: "Cancelar",
        selectCountries: "Seleccione países",
        selectLanguage: "Seleccione el idioma",
        actions: "Acciones",
        searchCountries: "Buscar países...",
        searchLanguages: "Buscar idiomas...",
        addDomain: "Añadir Dominio",
        editDomain: "Editar Dominio",
        domainName: "Nombre de Dominio",
        subdomains: "Subdominios",
        noDomains: "No se encontraron dominios.",
        addSubdomain: "Añadir Subdominio",
        subdomainName: "Nombre (ej: www)",
        gamAccount: "Cuenta GAM",
        gamCountry: "País de la Cuenta GAM",
        partnership: "Asociación",
        planningSheetUrl: "URL de la Hoja",
        publisherAdx: "Nombre ADX",
        preloader: "Pre-loader",
        offerwall: "Offerwall",
        pinReceived: "PIN Recibido",
        yes: "Sí",
        no: "No",
        categories: "Categorías",
        addCategory: "Añadir una categoría...",
        delete: "Eliminar",
        confirmDelete: "Confirmar Eliminación",
        areYouSureDelete: "¿Estás seguro de que quieres eliminar este dominio?",
        updateLogo: "Actualizar Logo",
        selectFile: "Seleccionar archivo",
        addBm: "Añadir BM",
        editBm: "Editar BM",
        bmName: "Nombre del BM",
        bmId: "ID del BM",
        noBms: "No se encontraron BMs.",
        accessVerification: "Verificación de Acceso",
        itProviderVerified: "Verificado como Proveedor de TI",
        areYouSureDeleteBm: "¿Estás seguro de que quieres eliminar este BM?",
        activeDomains: "Dominios Activos",
        inactiveItems: "Elementos Inactivos",
        inactiveDomains: "Dominios Principais Inactivos",
        inactiveSubdomains: "Subdominios Inactivos",
        withPin: "Con PIN",
        withoutPin: "Sin PIN",
        viewGrouped: "Vista Agrupada",
        viewByLanguage: "Vista por Idioma",
        date: "Fecha",
        entity: "Entidad",
        action: "Acción",
        details: "Detalles",
        noHistory: "No se encontró historial de actividad.",
        entityDomain: "Dominio",
        entitySubdomain: "Subdomínio",
        entityBM: "BM",
        actionCreate: "Crear",
        actionUpdate: "Actualizar",
        actionDelete: "Eliminar",
        actionActivate: "Activar",
        actionDeactivate: "Desactivar",
        parentDomain: "Dominio Principal",
        addAdAccount: "Añadir Cuenta Publicitaria",
        adAccountName: "Nombre de la Cuenta",
        accountId: "ID de la Cuenta",
        paymentMethod: "Método de Pago",
        paymentMethodOwner: "Dueño del Pago",
        noAdAccounts: "No se encontraron cuentas publicitarias.",
        configuration: "Configuración",
        logout: "Cerrar Sesión",
        username: "Usuario",
        password: "Contraseña",
        login: "Iniciar Sesión",
        loginFailed: "Credenciales inválidas.",
        welcomeLogin: "Bienvenido al Centro de Proyectos",
        loginDescription: "Por favor, inicie sesión para continuar.",
        appName: "Nombre de la App",
        appId: "ID de la App",
        addApp: "Añadir App",
        noAdAccountsInBm: "No se encontraron cuentas publicitarias para este BM.",
        noAppsInBm: "No se encontraron aplicaciones para este BM.",
        partnerships: "Asociaciones",
        addPartnership: "Añadir Asociación",
        editPartnership: "Editar Asociación",
        partnershipName: "Nombre de la Asociación",
        acronym: "Acrónimo",
        discord: "Discord",
        whatsapp: "WhatsApp",
        notes: "Notas",
        noPartnerships: "No se encontraron asociaciones.",
        areYouSureDeletePartnership: "¿Estás seguro de que quieres eliminar esta asociación?",
        entityPartnership: "Asociación",
        appDomain: "Dominio de la App",
        permissions: "Permisos",
        approvalStep: "Paso de Aprobación",
        step: "Paso",
        appLogin: "Login de la App",
        appUrl: "URL de la App",
        selectPartnership: "Seleccionar asociación",
        searchPartnerships: "Buscar asociaciones...",
        noChatbots: "No se encontraron chatbots/apps.",
        bmParent: "BM Padre",
        editApp: "Editar App",
        appCredentials: "Credenciales de la App",
        step1_label: "Creación",
        step2_label: "Llamadas a la API",
        step3_label: "Acceso a Permisos Avanzados",
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
        selectAdAccount: "Seleccionar cuenta publicitaria",
        searchAdAccounts: "Buscar cuentas publicitarias...",
        selectChatbot: "Seleccionar chatbot",
        searchChatbots: "Buscar chatbots...",
        selectProjects: "Seleccionar proyectos",
        searchProjects: "Buscar proyectos...",
        category: "Categoría",
        selectCategory: "Seleccione una categoría",
        searchCategories: "Buscar categorías...",
        selectPartnerships: "Seleccione asociaciones",
        selectBm: "Seleccione un BM",
        projectStatus: "Estado del Proyecto",
        selectProjectStatus: "Seleccione un estado",
        searchStatus: "Buscar estado...",
        hasRunningCampaigns: "Tiene campañas activas",
        analyst: "Analista",
        selectAnalyst: "Seleccione un analista",
        searchAnalyst: "Buscar analista...",
        statusInProgress: "En Progreso",
        statusPending: "Pendiente",
        statusActive: "Activo",
        statusDeactivated: "Desactivado",
        statusPaused: "Pausado",
        statusBroad: "Broadcast",
        
        // Profiles
        addProfile: "Añadir Perfil",
        editProfile: "Editar Perfil",
        profileName: "Nombre del Perfil",
        facebookId: "ID de Facebook",
        purchaseDate: "Fecha de Compra",
        supplier: "Proveedor",
        price: "Precio",
        profileStatus: "Estado del Perfil",
        profileRole: "Rol",
        securityKey: "Clave de Seguridad",
        email: "Correo Electrónico",
        accountStatus: "Estado de la Cuenta de Facebook",
        driveLink: "Enlace de Drive",
        noProfiles: "No se encontraron perfiles.",
        areYouSureDeleteProfile: "¿Estás seguro de que quieres eliminar este perfil?",
        entityProfile: "Perfil",
        statusWarmUp: "Calentamiento",
        statusStock: "Stock",
        statusInUse: "En Uso",
        statusInvalidated: "Invalidado",
        roleAdvertiser: "Anunciante",
        roleContingency: "Contingencia",
        roleBot: "Bot",
        roleBackup: "Respaldo",
        accountStatusOK: "OK",
        accountStatusIssues: "Perfil con problemas",
        accountStatusRisk: "Perfil en riesgo",
        addEmail: "Añadir correo electrónico...",
        selectProfileStatus: "Seleccione el estado",
        selectRole: "Seleccione el rol",
        selectSecurityKey: "Seleccione las claves",
        selectAccountStatus: "Seleccione el estado de la cuenta",
        recoveryEmail: "Correo de Recuperación",
        emailPassword: "Contraseña del Correo",
        facebookPassword: "Contraseña de Facebook",
        twoFactorCode: "Código 2FA",
        addProfilesBulk: "Añadir Perfiles en Lote",
        addProfilesBulkDescription: "Revise los perfiles extraídos de los archivos y edite la información según sea necesario.",
        parsingProfiles: "Leyendo archivos...",
        exportToAdsPower: "Exportar a AdsPower",
        selected: "Seleccionados",
        selectAll: "Seleccionar Todos",

        // Pages
        addPage: "Añadir Página",
        editPage: "Editar Página",
        pageName: "Nombre de la Página",
        noPages: "No se encontraron páginas.",
        areYouSureDeletePage: "¿Estás seguro de que quieres eliminar esta página?",
        entityPage: "Página",
        pageIdExistsError: "Ya existe una página con este ID de Facebook.",
        addPagesBulk: "Añadir Páginas en Lote",
        addPagesBulkDescription: "Edita los nombres transcritos y añade el ID de Facebook para cada página.",
        bulkSaveError: "Algunos elementos no se pudieron guardar. Por favor, revisa los errores a continuación.",
        saveAll: "Guardar Todas",
        saving: "Guardando...",
        transcribing: "Transcribiendo imagen...",
        uploadImage: "Subir Imagen",
        uploadOrPaste: "Subir una imagen o pegar desde el portapapeles (Ctrl+V)",
        extractPages: "Extraer Páginas",
        selectImage: "Seleccionar Imagen",
        changeImage: "Cambiar Imagen",
        noImageSelected: "Ninguna imagen seleccionada",
        importFromIntegration: "Importar desde Integración",
        selectIntegration: "Seleccionar Integración",
        connect: "Conectar",
        selectProject: "Seleccionar Proyecto",
        fetchProfiles: "Obtener Perfiles",
        fetchPages: "Obtener Páginas",
        foundPages: "Páginas Encontradas",
        importSelected: "Importar Seleccionadas",
        connecting: "Conectando...",
        fetching: "Obteniendo...",
        noProjectsFound: "No se encontraron proyectos.",
        noProfilesFound: "No se encontraron perfiles.",
        importSuccess: "¡Páginas importadas con éxito!",

        // Integrations
        integrations: "Integraciones",
        addIntegration: "Añadir Integración",
        editIntegration: "Editar Integración",
        integrationName: "Nombre de la Integración",
        baseUrl: "URL Base",
        loginUrl: "URL de Inicio de Sesión",
        userId: "ID de Usuario",
        noIntegrations: "No hay integraciones configuradas.",
        areYouSureDeleteIntegration: "¿Está seguro de que desea eliminar esta integración?",
        entityIntegration: "Integración",
    }
};

export const App: React.FC = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    });
    const [user, setUser] = useState<{ name: string } | null>(null);
    const [view, setView] = useState<View>('dashboard');
    const [language, setLanguage] = useState<'pt' | 'en' | 'es'>('pt');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [logoSrc, setLogoSrc] = useState<string | null>(null);
    const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
    const [domainViewMode, setDomainViewMode] = useState<DomainViewMode>('grouped');
    const [bmDetailViewType, setBmDetailViewType] = useState<'adAccounts' | 'apps'>('adAccounts');
    const [loginError, setLoginError] = useState('');

    // Data Fetching Hooks
    const projects = useSupabase<Project>('projects');
    const domains = useSupabase<Domain>('domains');
    const bms = useSupabase<BM>('bms');
    const partnerships = useSupabase<Partnership>('partnerships');
    const profiles = useSupabase<Profile>('profiles');
    const pages = useSupabase<Page>('pages');
    const integrations = useSupabase<Integration>('integrations');

    const t = translations[language];

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    useEffect(() => {
        const savedLogo = localStorage.getItem('projectHubLogo');
        if (savedLogo) setLogoSrc(savedLogo);
        
        const savedUser = localStorage.getItem('projectHubUser');
        if (savedUser) setUser(JSON.parse(savedUser));
    }, []);

    const handleLogin = (u: string, p: string) => {
        // Simple mock login
        if (u === 'admin' && p === 'admin') {
            const userData = { name: 'Admin' };
            setUser(userData);
            localStorage.setItem('projectHubUser', JSON.stringify(userData));
            setLoginError('');
        } else {
            setLoginError(translations[language].loginFailed);
        }
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('projectHubUser');
    };

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const handleSaveLogo = (newLogoSrc: string) => {
        setLogoSrc(newLogoSrc);
        localStorage.setItem('projectHubLogo', newLogoSrc);
        setIsLogoModalOpen(false);
    };

    // --- Actions wrappers ---
    const handleSaveProject = (data: any) => projectApi.save(data);
    
    const handleSaveDomain = (data: any) => domainApi.save(data);
    const handleDeleteDomain = (data: any) => domainApi.delete(data);
    const handleToggleDomainActive = (id: string, isActive: boolean) => {
        const domain = domains.find(d => d.id === id);
        domainApi.toggleActive(id, isActive, domain?.name || 'Unknown');
    };
    const handleToggleSubdomainActive = async (domainId: string, subdomainId: string, isActive: boolean) => {
        const domain = domains.find(d => d.id === domainId);
        if (domain) {
            const updatedSubdomains = domain.subdomains.map(sub =>
                sub.id === subdomainId ? { ...sub, isActive } : sub
            );
            domainApi.updateSubdomains(domainId, updatedSubdomains, domain.name);
        }
    };

    const handleSaveBm = (data: any) => bmApi.save(data);
    const handleDeleteBm = (data: any) => bmApi.delete(data);
    
    const handleSaveApp = async (app: AppData) => {
        const bm = bms.find(b => b.apps.some(a => a.id === app.id));
        if (bm) {
            const updatedApps = bm.apps.map(a => a.id === app.id ? app : a);
            bmApi.updateApps(bm.id, updatedApps, bm.name);
        }
    };

    const handleSavePartnership = (data: any) => partnershipApi.save(data);
    const handleDeletePartnership = (data: any) => partnershipApi.delete(data);

    const handleSaveProfile = async (profileData: Omit<Profile, 'id'> & { id?: string }) => {
        const oldProfile = profiles.find(p => p.id === profileData.id);
        await profileApi.save(profileData, oldProfile?.pageIds || []);
    };
    const handleDeleteProfile = (data: any) => profileApi.delete(data);

    const handleSavePage = async (pageData: Omit<Page, 'id' | 'provider'> & { id?: string }) => {
        const oldPage = pages.find(p => p.id === pageData.id);
        await pageApi.save(pageData, oldPage?.profileIds || []);
    };
    const handleDeletePage = (data: any) => pageApi.delete(data);

    const handleSaveIntegration = (data: any) => integrationApi.save(data);
    const handleDeleteIntegration = (data: any) => integrationApi.delete(data);

    // --- AI Handlers ---
    const parseProfilesFromFiles = async (files: File[]): Promise<Partial<Profile>[]> => {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        let combinedText = "";
        for (const file of files) {
            const text = await file.text();
            combinedText += `\n--- FILE START: ${file.name} ---\n${text}\n--- FILE END ---\n`;
        }

        const prompt = `
        You are a data extraction assistant. Extract Facebook profile credentials from the provided text.
        The text may contain multiple profiles in various formats.
        
        Return a strictly valid JSON array of objects with the following keys:
        - name: The profile name (if available, else empty string)
        - facebookId: The login ID, phone number, or username used for Facebook login.
        - facebookPassword: The password for Facebook.
        - twoFactorCode: The 2FA secret key (usually a 32-character string, sometimes separated by spaces). If it's a URL, extract the 'key' parameter.
        - email: The primary email address.
        - emailPassword: The password for the email.
        - recoveryEmail: The recovery email address.
        - purchaseDate: The date of birth if found (format YYYY-MM-DD), otherwise use today's date.

        Ignore cookies or other binary data representations. Focus on credentials.
        
        Text to process:
        ${combinedText}
        `;

        try {
            const result = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                config: { responseMimeType: "application/json" }
            });
            const responseText = result.text;
            if(!responseText) return [];
            return JSON.parse(responseText);
        } catch (e) {
            console.error("AI Parsing failed", e);
            return [];
        }
    }

    const handleBulkSaveProfiles = async (profilesToSave: Partial<Profile>[]): Promise<{ success: boolean; errors: { facebookId: string, message: string }[] }> => {
        const errors: { facebookId: string, message: string }[] = [];
        const validProfiles: any[] = [];
        const seenIds = new Set<string>();

        // 1. Validate within the batch
        for (const p of profilesToSave) {
            const fbId = p.facebookId || '';
            if (!fbId) continue; 
            if (seenIds.has(fbId)) {
                errors.push({ facebookId: fbId, message: 'Duplicate in batch' });
            } else {
                seenIds.add(fbId);
                const email = (p as any).email;
                 validProfiles.push({
                    id: crypto.randomUUID(),
                    name: p.name || 'Untitled Profile',
                    facebookId: fbId,
                    facebookPassword: p.facebookPassword || '',
                    twoFactorCode: p.twoFactorCode || '',
                    emails: email ? [email] : [],
                    emailPassword: p.emailPassword || '',
                    recoveryEmail: p.recoveryEmail || '',
                    purchaseDate: p.purchaseDate ? new Date(p.purchaseDate).toISOString() : new Date().toISOString(),
                    supplier: 'Bulk Import',
                    price: 0,
                    status: 'Stock' as ProfileStatus,
                    role: ProfileRole.Advertiser,
                    securityKeys: [],
                    accountStatus: 'OK' as AccountStatus,
                    driveLink: '',
                    pageIds: [],
                    bmIds: [],
                    projectIds: []
                });
            }
        }

        // 2. Save
        try {
            await profileApi.bulkSave(validProfiles);
        } catch (err: any) {
             console.error("Bulk profile save failed", err);
             return { success: false, errors: [{ facebookId: 'ALL', message: err.message || 'Save failed' }] };
        }

        return { success: errors.length === 0, errors };
    };

    const transcribePageNamesFromImage = async (base64Image: string): Promise<string[]> => {
        try {
            const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
            const mimeType = base64Image.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)?.[1] || 'image/png';

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: {
                    parts: [
                        { inlineData: { mimeType: mimeType, data: base64Data } },
                        { text: "List all the names of Facebook pages visible in this image. Return only a valid JSON array of strings, e.g., [\"Page Name 1\", \"Page Name 2\"]. Do not include markdown formatting." }
                    ]
                },
                 config: { responseMimeType: "application/json" }
            });

            const text = response.text;
            if (!text) return [];
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(cleanText);

        } catch (error) {
            console.error("Error transcribing image:", error);
            return [];
        }
    };

    const handleBulkSavePages = async (pagesToSave: { name: string, facebookId: string }[]): Promise<{ success: boolean; errors: { facebookId: string, message: string }[] }> => {
        const errors: { facebookId: string, message: string }[] = [];
        const validPages: any[] = [];
        const seenIds = new Set<string>();

        for (const p of pagesToSave) {
            if (seenIds.has(p.facebookId)) {
                errors.push({ facebookId: p.facebookId, message: t.pageIdExistsError });
            } else {
                seenIds.add(p.facebookId);
                 validPages.push({
                    id: crypto.randomUUID(),
                    name: p.name,
                    facebookId: p.facebookId,
                    provider: 'Bulk Import',
                    profileIds: []
                });
            }
        }

        try {
            await pageApi.bulkSave(validPages);
        } catch (err: any) {
             console.error("Bulk save failed", err);
             return { success: false, errors: [{ facebookId: 'ALL', message: err.message }] };
        }

        return { success: errors.length === 0, errors };
    };

    // Helper functions
    const getCountryName = (code: string) => {
        const country = countryList.find(c => c.en === code || c.pt === code || c.es === code);
        if (!country) return code;
        return country[language as keyof typeof country] || code;
    };

    const getLanguageName = (code: string) => {
         const lang = languageList.find(l => l.en === code || l.pt === code || l.es === code);
         if (!lang) return code;
         return lang[language as keyof typeof lang] || code;
    };

    if (!user) {
        return <LoginView onLogin={handleLogin} t={t} error={loginError} />;
    }

    // Options for Selects
    const countryOptions = countryList.map(c => ({ value: c.en, label: c[language as keyof typeof c] }));
    const languageOptions = languageList.map(l => ({ value: l.en, label: l[language as keyof typeof l] }));
    const partnershipOptions = partnerships.map(p => ({ value: p.id, label: p.name }));
    const projectOptions = projects.map(p => ({ value: p.id, label: p.name }));
    const profileOptions = profiles.map(p => ({ value: p.id, label: p.name }));
    const bmOptions = bms.map(b => ({ value: b.id, label: b.name }));
    const pageOptions = pages.map(p => ({ value: p.id, label: p.name }));

    const renderView = () => {
        switch (view) {
            case 'projects':
                return <ProjectsView t={t} projects={projects} onSaveProject={handleSaveProject} getCountryName={getCountryName} getLanguageName={getLanguageName} countryOptions={countryOptions} languageOptions={languageOptions} domains={domains} bms={bms} partnerships={partnerships} profiles={profiles} pages={pages} />;
            case 'domains':
                return <DomainsView t={t} domains={domains} partnerships={partnerships} projects={projects} onSaveDomain={handleSaveDomain} onDeleteDomain={handleDeleteDomain} onToggleDomainActive={handleToggleDomainActive} onToggleSubdomainActive={handleToggleSubdomainActive} getCountryName={getCountryName} getLanguageName={getLanguageName} countryOptions={countryOptions} languageOptions={languageOptions} projectOptions={projectOptions} viewMode={domainViewMode} setViewMode={setDomainViewMode} />;
            case 'bms':
                return <BMsView t={t} bms={bms} partnerships={partnerships} onSaveBm={handleSaveBm} onDeleteBm={handleDeleteBm} getCountryName={getCountryName} countryOptions={countryOptions} detailViewType={bmDetailViewType} setDetailViewType={setBmDetailViewType} partnershipOptions={partnershipOptions} projectOptions={projectOptions} profileOptions={profileOptions} pageOptions={pageOptions} />;
            case 'chatbots':
                return <ChatbotsView t={t} bms={bms} partnerships={partnerships} onSaveApp={handleSaveApp} />;
            case 'partnerships':
                return <PartnershipsView t={t} partnerships={partnerships} onSavePartnership={handleSavePartnership} onDeletePartnership={handleDeletePartnership} projectOptions={projectOptions} profileOptions={profileOptions} bmOptions={bmOptions} />;
            case 'profiles':
                return <ProfilesView t={t} profiles={profiles} pages={pages} onSaveProfile={handleSaveProfile} onDeleteProfile={handleDeleteProfile} onParseProfiles={parseProfilesFromFiles} onBulkSaveProfiles={handleBulkSaveProfiles} />;
            case 'pages':
                return <PagesView t={t} pages={pages} profiles={profiles} integrations={integrations} onSavePage={handleSavePage} onDeletePage={handleDeletePage} onTranscribeImage={transcribePageNamesFromImage} onBulkSavePages={handleBulkSavePages} />;
            case 'configuration':
                return <ConfigurationView t={t} integrations={integrations} onSaveIntegration={handleSaveIntegration} onDeleteIntegration={handleDeleteIntegration} />;
            case 'history':
                return <DashboardView t={t} />;
            case 'dashboard':
            default:
                return <DashboardView t={t} />;
        }
    };

    return (
        <div className="flex h-screen bg-latte-base dark:bg-mocha-base text-latte-text dark:text-mocha-text transition-colors duration-300 font-sans">
            <Sidebar t={t} view={view} setView={setView} isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} logoSrc={logoSrc} onLogoClick={() => setIsLogoModalOpen(true)} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header t={t} language={language} onLanguageChange={setLanguage} theme={theme} onThemeToggle={toggleTheme} onLogout={handleLogout} onSettingsClick={() => setView('configuration')} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                    {renderView()}
                </main>
            </div>
            <UpdateLogoModal isOpen={isLogoModalOpen} onClose={() => setIsLogoModalOpen(false)} onSave={handleSaveLogo} t={t} />
        </div>
    );
};
