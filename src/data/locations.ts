export interface StateInfo {
  uf: string;
  name: string;
  defaultCity: string;
  cities: {
    [cityName: string]: string[];
  };
}

export const BRAZIL_LOCATIONS: { [uf: string]: StateInfo } = {
  GO: {
    uf: 'GO',
    name: 'Goiás',
    defaultCity: 'Goiânia',
    cities: {
      'Goiânia': [
        'Setor Bueno',
        'Setor Oeste',
        'Setor Marista',
        'Setor Central',
        'Jardim Goiás',
        'Setor Sul',
        'Campinas',
        'Parque Amazônia',
        'Jardim América',
        'Eldorado',
        'Nova Vila',
        'Setor Pedro Ludovico',
        'Setor Coimbra',
        'Jardim Balneário Meia Ponte',
        'Setor Jaó',
        'Parque das Laranjeiras',
        'Setor Urias Magalhães',
        'Vila Nova',
        'Setor Universitário',
        'Outro Bairro...'
      ],
      'Aparecida de Goiânia': [
        'Centro',
        'Vila Brasília',
        'Jardim Luz',
        'Garavelo',
        'Cidade Vera Cruz',
        'Buriti Sereno',
        'Santa Luzia',
        'Setor dos Afonsos',
        'Jardim Bela Vista',
        'Outro Bairro...'
      ],
      'Anápolis': [
        'Centro',
        'Jundiaí',
        'Bairro de Lourdes',
        'Bairro Jundiaí',
        'Jaiara',
        'Maracanã',
        'Cidade Jardim',
        'Outro Bairro...'
      ],
      'Rio Verde': [
        'Centro',
        'Jardim Goiás',
        'Setor Morada do Sol',
        'Bairro Popular',
        'Outro Bairro...'
      ],
      'Outra Cidade...': ['Outro Bairro...']
    }
  },
  DF: {
    uf: 'DF',
    name: 'Distrito Federal',
    defaultCity: 'Brasília',
    cities: {
      'Brasília': [
        'Asa Sul',
        'Asa Norte',
        'Sudoeste',
        'Noroeste',
        'Lago Sul',
        'Lago Norte',
        'Águas Claras',
        'Taguatinga',
        'Ceilândia',
        'Guará',
        'Outro Bairro...'
      ],
      'Outra Cidade...': ['Outro Bairro...']
    }
  },
  MS: {
    uf: 'MS',
    name: 'Mato Grosso do Sul',
    defaultCity: 'Campo Grande',
    cities: {
      'Campo Grande': [
        'Centro',
        'Jardim dos Estados',
        'Chácara Cachoeira',
        'Tiradentes',
        'Rita Vieira',
        'Carandá Bosque',
        'Coophavila II',
        'Aero Rancho',
        'Outro Bairro...'
      ],
      'Corumbá': [
        'Centro',
        'Maria Leite',
        'Nova Corumbá',
        'Universitário',
        'Popular Velha',
        'Cervejaria',
        'Jardim dos Estados',
        'Dom Bosco',
        'Guarani',
        'Aeroporto',
        'Outro Bairro...'
      ],
      'Dourados': [
        'Centro',
        'Jardim Água Boa',
        'Jardim Climax',
        'Vila Industrial',
        'Outro Bairro...'
      ],
      'Outra Cidade...': ['Outro Bairro...']
    }
  },
  SP: {
    uf: 'SP',
    name: 'São Paulo',
    defaultCity: 'São Paulo',
    cities: {
      'São Paulo': [
        'Centro',
        'Moema',
        'Pinheiros',
        'Itaim Bibi',
        'Vila Mariana',
        'Tatuapé',
        'Mooca',
        'Perdizes',
        'Santana',
        'Santo Amaro',
        'Outro Bairro...'
      ],
      'Campinas': [
        'Centro',
        'Cambuí',
        'Guanabara',
        'Barão Geraldo',
        'Taquaral',
        'Outro Bairro...'
      ],
      'Outra Cidade...': ['Outro Bairro...']
    }
  },
  RJ: {
    uf: 'RJ',
    name: 'Rio de Janeiro',
    defaultCity: 'Rio de Janeiro',
    cities: {
      'Rio de Janeiro': [
        'Copacabana',
        'Ipanema',
        'Botafogo',
        'Tijuca',
        'Barra da Tijuca',
        'Centro',
        'Flamengo',
        'Outro Bairro...'
      ],
      'Niterói': [
        'Icaraí',
        'Centro',
        'Ingá',
        'Santa Rosa',
        'Outro Bairro...'
      ],
      'Outra Cidade...': ['Outro Bairro...']
    }
  },
  MG: {
    uf: 'MG',
    name: 'Minas Gerais',
    defaultCity: 'Belo Horizonte',
    cities: {
      'Belo Horizonte': [
        'Centro',
        'Savassi',
        'Lourdes',
        'Pampulha',
        'Buritis',
        'Sion',
        'Santo Antônio',
        'Outro Bairro...'
      ],
      'Outra Cidade...': ['Outro Bairro...']
    }
  },
  PR: {
    uf: 'PR',
    name: 'Paraná',
    defaultCity: 'Curitiba',
    cities: {
      'Curitiba': [
        'Centro',
        'Batel',
        'Água Verde',
        'Bigorrilho',
        'Cabral',
        'Portão',
        'Outro Bairro...'
      ],
      'Outra Cidade...': ['Outro Bairro...']
    }
  },
  RS: {
    uf: 'RS',
    name: 'Rio Grande do Sul',
    defaultCity: 'Porto Alegre',
    cities: {
      'Porto Alegre': [
        'Moinhos de Vento',
        'Centro Histórico',
        'Petrópolis',
        'Bela Vista',
        'Menino Deus',
        'Outro Bairro...'
      ],
      'Outra Cidade...': ['Outro Bairro...']
    }
  },
  SC: {
    uf: 'SC',
    name: 'Santa Catarina',
    defaultCity: 'Florianópolis',
    cities: {
      'Florianópolis': [
        'Centro',
        'Trindade',
        'Agronômica',
        'Itacorubi',
        'Coqueiros',
        'Outro Bairro...'
      ],
      'Outra Cidade...': ['Outro Bairro...']
    }
  },
  BA: {
    uf: 'BA',
    name: 'Bahia',
    defaultCity: 'Salvador',
    cities: {
      'Salvador': [
        'Pituba',
        'Barra',
        'Ondina',
        'Caminho das Árvores',
        'Itaigara',
        'Outro Bairro...'
      ],
      'Outra Cidade...': ['Outro Bairro...']
    }
  },
  PE: {
    uf: 'PE',
    name: 'Pernambuco',
    defaultCity: 'Recife',
    cities: {
      'Recife': [
        'Boa Viagem',
        'Espinheiro',
        'Parnamirim',
        'Graças',
        'Casa Forte',
        'Outro Bairro...'
      ],
      'Outra Cidade...': ['Outro Bairro...']
    }
  },
  CE: {
    uf: 'CE',
    name: 'Ceará',
    defaultCity: 'Fortaleza',
    cities: {
      'Fortaleza': [
        'Meireles',
        'Aldeota',
        'Cocó',
        'Dionísio Torres',
        'Varjota',
        'Outro Bairro...'
      ],
      'Outra Cidade...': ['Outro Bairro...']
    }
  }
};

export const ALL_UFS = Object.keys(BRAZIL_LOCATIONS);
