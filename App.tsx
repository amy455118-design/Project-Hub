


import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db';
import { Project, Domain, BM, HistoryEntry, Partnership, App, Profile, Page, AdAccount, View, DomainViewMode } from './types';

import { countryList } from './data/countries';
import { languageList } from './data/languages';

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
import { HistoryView } from './components/views/HistoryView';
import { ProfilesView } from './components/views/ProfilesView';
import { PagesView } from './components/views/PagesView';


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
        activeDomains: "Domínios Ativos",
        inactiveItems: "Itens Inativos",
        inactiveDomains: "Domínios Principais Inativos",
        inactiveSubdomains: "Subdomínios Inativos",
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
        // FIX: Renamed 'selectStatus' to avoid duplication. This key is for the project status.
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
        statusInvalidated: "Invalidado",
        roleAdvertiser: "Anunciante",
        roleContingency: "Contingência",
        roleBot: "Bot",
        roleBackup: "Backup",
        accountStatusOK: "OK",
        accountStatusIssues: "Perfil com problemas",
        accountStatusRisk: "Perfil em risco",
        addEmail: "Adicionar e-mail...",
        // FIX: Renamed 'selectStatus' to avoid duplication. This key is for the profile status.
        selectProfileStatus: "Selecione o status",
        selectRole: "Selecione a função",
        selectSecurityKey: "Selecione as chaves",
        selectAccountStatus: "Selecione o status da conta",
        recoveryEmail: "E-mail de Recuperação",
        emailPassword: "Senha do E-mail",
        facebookPassword: "Senha do Facebook",
        twoFactorCode: "Código 2FA",

        // Pages
        addPage: "Adicionar Página",
        editPage: "Editar Página",
        pageName: "Nome da Página",
        noPages: "Nenhuma página encontrada.",
        areYouSureDeletePage: "Tem certeza que deseja excluir esta página?",
        entityPage: "Página",
        pageIdExistsError: "Já existe uma página com este ID do Facebook.",
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
        // FIX: Renamed 'selectStatus' to avoid duplication. This key is for the project status.
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
        // FIX: Renamed 'selectStatus' to avoid duplication. This key is for the profile status.
        selectProfileStatus: "Select status",
        selectRole: "Select role",
        selectSecurityKey: "Select keys",
        selectAccountStatus: "Select account status",
        recoveryEmail: "Recovery Email",
        emailPassword: "Email Password",
        facebookPassword: "Facebook Password",
        twoFactorCode: "2FA Code",

        // Pages
        addPage: "Add Page",
        editPage: "Edit Page",
        pageName: "Page Name",
        noPages: "No pages found.",
        areYouSureDeletePage: "Are you sure you want to delete this page?",
        entityPage: "Page",
        pageIdExistsError: "A page with this Facebook ID already exists.",
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
        // FIX: Renamed 'selectStatus' to avoid duplication. This key is for the project status.
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
        // FIX: Renamed 'selectStatus' to avoid duplication. This key is for the profile status.
        selectProfileStatus: "Seleccione el estado",
        selectRole: "Seleccione el rol",
        selectSecurityKey: "Seleccione las claves",
        selectAccountStatus: "Seleccione el estado de la cuenta",
        recoveryEmail: "Correo de Recuperación",
        emailPassword: "Contraseña del Correo",
        facebookPassword: "Contraseña de Facebook",
        twoFactorCode: "Código 2FA",

        // Pages
        addPage: "Añadir Página",
        editPage: "Editar Página",
        pageName: "Nombre de la Página",
        noPages: "No se encontraron páginas.",
        areYouSureDeletePage: "¿Estás seguro de que quieres eliminar esta página?",
        entityPage: "Página",
        pageIdExistsError: "Ya existe una página con este ID de Facebook.",
    }
};

const App: React.FC = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    });

    const [language, setLanguage] = useState<'pt' | 'en' | 'es'>('pt');
    const [view, setView] = useState<View>('dashboard');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [logoSrc, setLogoSrc] = useState<string | null>(null);
    const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
    const [domainViewMode, setDomainViewMode] = useState<DomainViewMode>('grouped');
    const [bmDetailViewType, setBmDetailViewType] = useState<'adAccounts' | 'apps'>('adAccounts');
    const [isAuthenticated, setIsAuthenticated] = useState(() => sessionStorage.getItem('isAuthenticated') === 'true');
    const [loginError, setLoginError] = useState('');

    const projects = useLiveQuery(() => db.projects.toArray(), []);
    const domains = useLiveQuery(() => db.domains.toArray(), []);
    const profiles = useLiveQuery(() => db.profiles.toArray(), []);
    const pages = useLiveQuery(() => db.pages.toArray(), []);
    const bms = useLiveQuery(() => db.bms.toArray(), []);
    const partnerships = useLiveQuery(() => db.partnerships.toArray(), []);
    const history = useLiveQuery(() => db.history.orderBy('timestamp').reverse().toArray(), []);


    const t = translations[language];
    
    const logHistory = useCallback(async (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => {
        const newEntry: HistoryEntry = {
            id: crypto.randomUUID(),
            timestamp: new Date(),
            ...entry,
        };
        await db.history.add(newEntry);
    }, []);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);
    
    useEffect(() => {
        const savedLogo = localStorage.getItem('custom-logo');
        if (savedLogo) {
            setLogoSrc(savedLogo);
        }
    }, []);

    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

    const handleLanguageChange = (lang: 'pt' | 'en' | 'es') => {
        setLanguage(lang);
    };

    const handleLogin = (username: string, password) => {
        if (username === 'Admin' && password === 'admin') {
            sessionStorage.setItem('isAuthenticated', 'true');
            setIsAuthenticated(true);
            setLoginError('');
        } else {
            setLoginError(t.loginFailed);
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('isAuthenticated');
        setIsAuthenticated(false);
        setView('dashboard'); // Reset view on logout
    };

    const getCountryName = useCallback((countryCode: string) => {
        const country = countryList.find(c => c.en === countryCode);
        return country?.[language] || countryCode;
    }, [language]);

    const getLanguageName = useCallback((langCode: string) => {
        const lang = languageList.find(l => l.en === langCode);
        return lang?.[language] || langCode;
    }, [language]);
    
    const countryOptions = useMemo(() => countryList.map(c => ({ value: c.en, label: c[language] })), [language]);
    const languageOptions = useMemo(() => languageList.map(l => ({ value: l.en, label: l[language] })), [language]);

    // Derived lists for relationship selects
    const allAdAccounts = useMemo(() => bms?.flatMap(bm => bm.adAccounts.map(acc => ({...acc, bmName: bm.name}))) || [], [bms]);
    const allApps = useMemo(() => bms?.flatMap(bm => bm.apps.map(app => ({...app, bmName: bm.name}))) || [], [bms]);
    
    const projectOptions = useMemo(() => projects?.map(p => ({ value: p.id, label: p.name })) || [], [projects]);
    const domainOptions = useMemo(() => domains?.map(d => ({ value: d.id, label: d.name })) || [], [domains]);
    const profileOptions = useMemo(() => profiles?.map(p => ({ value: p.id, label: p.name })) || [], [profiles]);
    const pageOptions = useMemo(() => pages?.map(p => ({ value: p.id, label: p.name })) || [], [pages]);
    const bmOptions = useMemo(() => bms?.map(b => ({ value: b.id, label: b.name })) || [], [bms]);
    const partnershipOptions = useMemo(() => partnerships?.map(p => ({ value: p.id, label: p.name })) || [], [partnerships]);
    const adAccountOptions = useMemo(() => allAdAccounts.map(a => ({ value: a.id, label: `${a.name} (${a.bmName})` })), [allAdAccounts]);
    const chatbotOptions = useMemo(() => allApps.map(a => ({ value: a.id, label: `${a.name} (${a.bmName})` })), [allApps]);


    // Data modification functions
    const handleSaveProject = async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => {
        const isEditing = !!projectData.id;
        const projectId = projectData.id || crypto.randomUUID();
        
        let existingProject: Project | undefined;
        if(isEditing) {
            existingProject = await db.projects.get(projectId);
        }

        const finalProjectData: Project = {
            ...projectData,
            id: projectId,
            createdAt: existingProject?.createdAt || new Date(),
            updatedAt: new Date(),
        };
        
        await db.projects.put(finalProjectData);
        logHistory({ 
            entityType: 'Project', 
            entityName: finalProjectData.name, 
            action: isEditing ? 'Update' : 'Create',
            details: isEditing ? `Status changed to ${finalProjectData.status}` : ''
        });
    };

    const handleSaveDomain = async (domainData: Omit<Domain, 'id'> & { id?: string }) => {
        const isEditing = !!domainData.id;
        const domainId = domainData.id || crypto.randomUUID();

        const finalDomainData: Domain = {
            isActive: true,
            ...domainData,
            id: domainId,
        };

        await db.domains.put(finalDomainData);
        logHistory({ 
            entityType: 'Domain', 
            entityName: finalDomainData.name, 
            action: isEditing ? 'Update' : 'Create' 
        });
    };

    const handleToggleDomainActive = async (domainId: string, isActive: boolean) => {
        const domain = await db.domains.get(domainId);
        if (domain) {
            await db.domains.update(domainId, { isActive });
            logHistory({ entityType: 'Domain', entityName: domain.name, action: isActive ? 'Activate' : 'Deactivate' });
        }
    };

    const handleToggleSubdomainActive = async (domainId: string, subdomainId: string, isActive: boolean) => {
        const domain = await db.domains.get(domainId);
        if (domain) {
            let subName = '';
            const updatedSubdomains = domain.subdomains.map(sub => {
                if (sub.id === subdomainId) {
                    subName = sub.name.includes('.') ? sub.name : `${sub.name}.${domain.name}`;
                    return { ...sub, isActive };
                }
                return sub;
            });
            await db.domains.update(domainId, { subdomains: updatedSubdomains });
            logHistory({ entityType: 'Subdomain', entityName: subName, action: isActive ? 'Activate' : 'Deactivate', details: `Parent: ${domain.name}` });
        }
    };
    
    const handleDeleteDomain = async (domain: Domain) => {
        await db.domains.delete(domain.id);
        logHistory({ entityType: 'Domain', entityName: domain.name, action: 'Delete' });
    };

    const handleSaveProfile = async (profileData: Omit<Profile, 'id'> & { id?: string }) => {
        const isEditing = !!profileData.id;
        const profileId = profileData.id || crypto.randomUUID();

        const finalProfileData: Profile = {
            ...profileData,
            id: profileId,
        };

        await db.profiles.put(finalProfileData);
        logHistory({
            entityType: 'Profile',
            entityName: finalProfileData.name,
            action: isEditing ? 'Update' : 'Create'
        });
    };

    const handleDeleteProfile = async (profile: Profile) => {
        await db.profiles.delete(profile.id);
        logHistory({ entityType: 'Profile', entityName: profile.name, action: 'Delete' });
    };

    const handleSavePage = async (pageData: Omit<Page, 'id' | 'provider' | 'profileIds'> & { id?: string }) => {
        const isEditing = !!pageData.id;
        const pageId = pageData.id || crypto.randomUUID();

        const existingPageWithSameFbId = await db.pages.where('facebookId').equals(pageData.facebookId).first();
        if (existingPageWithSameFbId && existingPageWithSameFbId.id !== pageId) {
            return Promise.reject(new Error(t.pageIdExistsError));
        }
        
        if (isEditing) {
            await db.pages.update(pageId, {
                name: pageData.name,
                facebookId: pageData.facebookId
            });
             logHistory({
                entityType: 'Page',
                entityName: pageData.name,
                action: 'Update'
            });
        } else {
            const finalPageData: Page = {
                name: pageData.name,
                facebookId: pageData.facebookId,
                id: pageId,
                provider: '',
                profileIds: [],
            };
             await db.pages.put(finalPageData);
            logHistory({
                entityType: 'Page',
                entityName: finalPageData.name,
                action: 'Create'
            });
        }

        return Promise.resolve();
    };

    const handleDeletePage = async (page: Page) => {
        await db.pages.delete(page.id);
        logHistory({ entityType: 'Page', entityName: page.name, action: 'Delete' });
    };
    
    const handleSaveBm = async (bmData: Omit<BM, 'id'> & { id?: string }) => {
        const isEditing = !!bmData.id;
        const bmId = bmData.id || crypto.randomUUID();
        
        const finalAdAccounts = (bmData.adAccounts || [])
            .filter(acc => acc.name.trim() || acc.accountId.trim())
            .map(acc => ({
                ...acc,
                id: acc.id || crypto.randomUUID()
            }));

        const finalApps = (bmData.apps || [])
            .filter(app => app.name.trim() || app.appId.trim())
            .map(app => ({
                ...app,
                id: app.id || crypto.randomUUID(),
            }));
        
        const finalBm: BM = {
            ...bmData,
            id: bmId,
            adAccounts: finalAdAccounts,
            apps: finalApps,
        };

        await db.bms.put(finalBm);
        logHistory({ entityType: 'BM', entityName: finalBm.name, action: isEditing ? 'Update' : 'Create' });
    };
    
    const handleDeleteBm = async (bm: BM) => {
        await db.bms.delete(bm.id);
        logHistory({ entityType: 'BM', entityName: bm.name, action: 'Delete' });
    };

    const handleSavePartnership = async (partnershipData: Omit<Partnership, 'id'> & { id?: string }) => {
        const isEditing = !!partnershipData.id;
        const partnershipId = partnershipData.id || crypto.randomUUID();
        
        const finalPartnership: Partnership = {
            ...partnershipData,
            id: partnershipId,
        };

        await db.partnerships.put(finalPartnership);
        logHistory({ entityType: 'Partnership', entityName: finalPartnership.name, action: isEditing ? 'Update' : 'Create' });
    };

    const handleDeletePartnership = async (partnership: Partnership) => {
        await db.partnerships.delete(partnership.id);
        logHistory({ entityType: 'Partnership', entityName: partnership.name, action: 'Delete' });
    };

    const handleSaveAppDetails = async (app: App) => {
        if (!bms) return;
        for (const bm of bms) {
            const appIndex = bm.apps.findIndex(a => a.id === app.id);
            if (appIndex > -1) {
                const updatedApps = [...bm.apps];
                updatedApps[appIndex] = app;
                await db.bms.update(bm.id, { apps: updatedApps });
                logHistory({ entityType: 'App', entityName: app.name, action: 'Update', details: `Parent BM: ${bm.name}` });
                break;
            }
        }
    };

    const renderView = () => {
        switch (view) {
            case 'projects':
                return <ProjectsView 
                            t={t} 
                            projects={projects || []} 
                            onSaveProject={handleSaveProject}
                            getCountryName={getCountryName}
                            getLanguageName={getLanguageName}
                            countryOptions={countryOptions}
                            languageOptions={languageOptions}
                            domains={domains || []}
                            bms={bms || []}
                            partnerships={partnerships || []}
                            profiles={profiles || []}
                            pages={pages || []}
                        />;
            case 'domains':
                return <DomainsView 
                            t={t} 
                            domains={domains || []}
                            partnerships={partnerships || []}
                            projects={projects || []}
                            onSaveDomain={handleSaveDomain}
                            onDeleteDomain={handleDeleteDomain}
                            onToggleDomainActive={handleToggleDomainActive}
                            onToggleSubdomainActive={handleToggleSubdomainActive}
                            getCountryName={getCountryName}
                            getLanguageName={getLanguageName}
                            countryOptions={countryOptions}
                            languageOptions={languageOptions}
                            viewMode={domainViewMode}
                            setViewMode={setDomainViewMode}
                            projectOptions={projectOptions}
                        />;
            case 'profiles':
                return <ProfilesView
                            t={t}
                            profiles={profiles || []}
                            onSaveProfile={handleSaveProfile}
                            onDeleteProfile={handleDeleteProfile}
                        />;
            case 'pages':
                return <PagesView
                            t={t}
                            pages={pages || []}
                            onSavePage={handleSavePage}
                            onDeletePage={handleDeletePage}
                        />;
            case 'bms':
                return <BMsView
                            t={t}
                            bms={bms || []}
                            partnerships={partnerships || []}
                            onSaveBm={handleSaveBm}
                            onDeleteBm={handleDeleteBm}
                            getCountryName={getCountryName}
                            countryOptions={countryOptions}
                            detailViewType={bmDetailViewType}
                            setDetailViewType={setBmDetailViewType}
                            projectOptions={projectOptions}
                            profileOptions={profileOptions}
                            pageOptions={pageOptions}
                            partnershipOptions={partnershipOptions}
                        />;
            case 'chatbots':
                return <ChatbotsView
                            t={t}
                            bms={bms || []}
                            partnerships={partnerships || []}
                            onSaveApp={handleSaveAppDetails}
                        />;
            case 'partnerships':
                return <PartnershipsView
                            t={t}
                            partnerships={partnerships || []}
                            onSavePartnership={handleSavePartnership}
                            onDeletePartnership={handleDeletePartnership}
                            projectOptions={projectOptions}
                            profileOptions={profileOptions}
                            bmOptions={bmOptions}
                        />;
            case 'history':
                return <HistoryView t={t} history={history || []} />;
            case 'dashboard':
                return <DashboardView t={t}/>;
            case 'configuration':
                 return (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="p-8 bg-latte-surface0 dark:bg-mocha-surface0 rounded-2xl shadow-lg">
                            <h2 className="text-3xl font-bold text-latte-mauve dark:text-mocha-mauve">
                                {t.configuration}
                            </h2>
                            <p className="mt-2 text-latte-subtext1 dark:text-mocha-subtext1">
                                This view is under construction.
                            </p>
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="p-8 bg-latte-surface0 dark:bg-mocha-surface0 rounded-2xl shadow-lg">
                            <h2 className="text-3xl font-bold text-latte-mauve dark:text-mocha-mauve">
                                {t[view as keyof typeof t] || view}
                            </h2>
                            <p className="mt-2 text-latte-subtext1 dark:text-mocha-subtext1">
                                This view is under construction.
                            </p>
                        </div>
                    </div>
                );
        }
    };

    if (!isAuthenticated) {
        return <LoginView onLogin={handleLogin} t={t} error={loginError} />;
    }
    
    return (
        <div className="flex h-screen font-sans">
            <Sidebar
                t={t}
                view={view}
                setView={setView}
                isCollapsed={isSidebarCollapsed}
                setIsCollapsed={setIsSidebarCollapsed}
                logoSrc={logoSrc}
                onLogoClick={() => setIsLogoModalOpen(true)}
            />

            <main className="flex-1 flex flex-col">
                <Header
                    t={t}
                    language={language}
                    onLanguageChange={handleLanguageChange}
                    theme={theme}
                    onThemeToggle={toggleTheme}
                    onLogout={handleLogout}
                    onSettingsClick={() => setView('configuration')}
                />
                <div className="flex-1 p-6 overflow-y-auto bg-latte-base dark:bg-mocha-base">
                    {renderView()}
                </div>
            </main>

            <UpdateLogoModal 
                isOpen={isLogoModalOpen}
                onClose={() => setIsLogoModalOpen(false)}
                onSave={(newLogoSrc) => {
                    setLogoSrc(newLogoSrc);
                    localStorage.setItem('custom-logo', newLogoSrc);
                    setIsLogoModalOpen(false);
                }}
                t={t}
            />
        </div>
    );
};

export default App;